import { query, pool } from "../db/index.js";
import { Commission } from "../models/index.js";
import { verifyToken } from "../auth/jwt.js";
import { checkIfExists, checkIfNameIsTaken } from "./helpers.js";

// GET

const getCommissions = async (req, res) => {
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
    const queryText = "SELECT * FROM COMMISSIONS WHERE creator_id = $1";
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

const getCommissionById = async (req, res) => {
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
    const commissionId = req.params.id;
    const creatorId = token.id;
    const queryText =
      "SELECT * FROM COMMISSIONS WHERE id = $1 AND creator_id = $2";
    const values = [commissionId, creatorId];
    const { rows } = await query(queryText, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCommissionByName = async (req, res) => {
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
    const queryText =
      "SELECT * FROM COMMISSIONS WHERE name = $1 AND creator_id = $2";
    const values = [req.params.name, token.id];
    const { rows } = await query(queryText, values);
    console.log(rows);
    res.status(200).send(rows[0]);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).send("Server error");
  }
};

// POST

const createCommission = async (req, res) => {
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

  let commissionToEnter = undefined;
  try {
    commissionToEnter = new Commission(req.body);
  } catch (error) {
    console.log(error);
    res.status(error.code).json({ error: error.message });
    return;
  }

  try {
    await checkIfNameIsTaken("Commission", commissionToEnter, token.id);
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
    INSERT INTO COMMISSIONS (
      name,
      description,
      freq_type,
      freq,
      difficulty,
      num_times_completed,
      completed,
      creator_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) RETURNING *;
    `;
    const values = commissionToEnter.getCommissionAsArray();
    console.log(values);
    const { rows } = await client.query(query, values);
    const newCommission = rows[0];

    await client.query("COMMIT");

    console.log(`Successfully created commission ${newCommission.id}`);
    res.status(201).json(newCommission);
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
// PUT

const updateCommission = async (req, res) => {
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

  let newCommission = undefined;
  try {
    newCommission = new Commission(req.body);
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
    await checkIfExists("Commission", newCommission.id, token.id);
    await checkIfNameIsTaken("Commission", newCommission, token.id);
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
    UPDATE COMMISSIONS SET
      name = $2,
      description = $3,
      freq_type = $4,
      freq = $5,
      difficulty = $6,
      num_times_completed = $7,
      completed = $8
    WHERE id = $1 AND creator_id = $9
    RETURNING *;
    `;
    const values = newCommission.getCommissionAsArray();
    const { rows } = await client.query(query, values);
    await client.query("COMMIT");

    newCommission = rows[0];
    console.log(`Successfully updated commission ${newCommission.id}`);
    res.status(200).json(newCommission);
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
// DELETE

const deleteCommission = async (req, res) => {
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

  let commissionToDeleteId = req.body.id;

  try {
    await checkIfExists("Commission", commissionToDeleteId, token.id);
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
    const creatorId = token.id;
    const queryText =
      "DELETE FROM COMMISSIONS WHERE id = $1 AND creator_id = $2 RETURNING *;";
    const values = [commissionToDeleteId, creatorId];
    const { rows } = await query(queryText, values);
    console.log(`Successfully deleted commission ${rows[0].id}`);
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
  getCommissions,
  getCommissionById,
  getCommissionByName,
  createCommission,
  updateCommission,
  deleteCommission,
};
