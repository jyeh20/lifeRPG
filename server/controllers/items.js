import { pool, query } from "../db/index.js";
import { verifyToken } from "../auth/jwt.js";
import { checkIfItemExists, checkIfItemNameIsTaken } from "./helpers.js";
import { Item } from "../models/index.js";

const getItems = async (req, res) => {
  let token = undefined;
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const queryText = "SELECT * FROM ITEMS WHERE creator_id = $1";
    const values = [token.id];
    const { rows } = await query(queryText, values);
    res.status(200).json(rows);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  }
};

const getItemById = async (req, res) => {
  let token = undefined;
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const itemId = req.params.id;
    const creatorId = token.id;
    const queryText = "SELECT * FROM ITEMS WHERE id = $1 AND creator_id = $2";
    const values = [itemId, creatorId];
    const { rows } = await query(queryText, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  }
};

const getItemByName = async (req, res) => {
  let token = undefined;

  if (!req.headers.authorization) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const queryText = "SELECT * FROM ITEMS WHERE name = $1 AND creator_id = $2";
    const values = [req.params.name, token.id];
    const { rows } = await query(queryText, values);
    res.status(200).send(rows[0]);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).send("Server error");
  }
};

const createItem = async (req, res) => {
  let token = undefined;
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  let itemToEnter = undefined;
  try {
    itemToEnter = new Item(req.body);
  } catch (error) {
    console.log(error);
    res.status(error.code).json({ error: error.message });
    return;
  }

  try {
    await checkIfItemNameIsTaken(itemToEnter, token.id);
  } catch (error) {
    console.log(error);
    /* istanbul ignore else */
    if (error.code === 409) {
      res.status(409).json({ error: error.message });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
    /* istanbul ignore next */
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = `
    INSERT INTO ITEMS (
      name,
      cost,
      item_url,
      creator_id
    ) VALUES (
      $1, $2, $3, $4
    ) RETURNING *;
    `;
    const values = itemToEnter.getItemAsArray();

    const { rows } = await client.query(query, values);
    const newItem = rows[0];

    await client.query("COMMIT");

    console.log(`Successfully created item ${newItem.id}`);
    res.status(201).json(newItem);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    await client.query("ROLLBACK");
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

const updateItem = async (req, res) => {
  console.log(req.body);
  let token = undefined;
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  let newItem = undefined;
  try {
    newItem = new Item(req.body);
  } catch (error) {
    console.log(error);
    /* istanbul ignore else */
    if (error.code === 403) {
      res.status(403).json({ error: error.message });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
    /* istanbul ignore next */
    return;
  }

  try {
    await checkIfItemExists(newItem.id, token.id);
    await checkIfItemNameIsTaken(newItem, token.id);
  } catch (error) {
    if (error.code === 404) {
      res.status(error.code).json({ error: error.message });
      return;
    }
    /* istanbul ignore else */
    if (error.code === 409) {
      res.status(error.code).json({ error: error.message });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
    /* istanbul ignore next */
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = `
    UPDATE ITEMS SET
      name = $2,
      cost = $3,
      item_url = $4
    WHERE id = $1 AND creator_id = $5
    RETURNING *;
    `;
    const values = newItem.getItemAsArray();
    const { rows } = await client.query(query, values);
    await client.query("COMMIT");

    newItem = rows[0];
    console.log(`Successfully updated item ${newItem.id}`);
    res.status(200).json(newItem);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    await client.query("ROLLBACK");
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

const deleteItem = async (req, res) => {
  let token = undefined;
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  let itemToDelete = undefined;
  try {
    itemToDelete = new Item(req.body);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid item format" });
    return;
  }

  try {
    console.log("deleting", itemToDelete);
    await checkIfItemExists(itemToDelete.id, token.id);
  } catch (error) {
    /* istanbul ignore else */
    if (error.code === 404) {
      res.status(error.code).json({ error: error.message });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
    /* istanbul ignore next */
    return;
  }

  const client = await pool.connect();
  try {
    client.query("BEGIN");
    const itemId = itemToDelete.id;
    const creatorId = token.id;
    const queryText =
      "DELETE FROM ITEMS WHERE id = $1 AND creator_id = $2 RETURNING *;";
    const values = [itemId, creatorId];
    const { rows } = await query(queryText, values);
    console.log(`Successfully deleted item ${rows[0].id}`);
    await client.query("COMMIT");
    res.status(200).json();
  } catch (error) {
    /* istanbul ignore next */
    await client.query("ROLLBACK");
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

export {
  getItems,
  getItemById,
  getItemByName,
  createItem,
  updateItem,
  deleteItem,
};
