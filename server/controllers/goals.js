import { pool, query } from "../db/index.js";
import { verifyToken } from "../auth/jwt.js";
import { checkIfExists, checkIfNameIsTaken } from "./helpers.js";
import { Goal } from "../models/index.js";

// GET

const getGoals = async (req, res) => {
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
    const queryText = "SELECT * FROM GOALS WHERE creator_id = $1";
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

const getGoalById = async (req, res) => {
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
    const goalId = req.params.id;
    const creatorId = token.id;
    const queryText = "SELECT * FROM GOALS WHERE id = $1 AND creator_id = $2";
    const values = [goalId, creatorId];
    const { rows } = await query(queryText, values);
    res.status(200).json(rows[0]);
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).json({ error: "Internal server error" });
  }
};

const getGoalByName = async (req, res) => {
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
    const queryText = "SELECT * FROM GOALS WHERE name = $1 AND creator_id = $2";
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

// POST

const createGoal = async (req, res) => {
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

  let goalToEnter = undefined;
  try {
    goalToEnter = new Goal(req.body);
  } catch (error) {
    console.log(error);
    res.status(error.code).json({ error: error.message });
    return;
  }

  try {
    await checkIfNameIsTaken("Goal", goalToEnter, token.id);
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
    INSERT INTO GOALS (
      name,
      description,
      reward,
      creator_id
    ) VALUES (
      $1, $2, $3, $4
    ) RETURNING *;
    `;
    const values = goalToEnter.getGoalAsArray();

    const { rows } = await client.query(query, values);
    const newGoal = rows[0];

    await client.query("COMMIT");

    console.log(`Successfully created goal ${newGoal.id}`);
    res.status(201).json(newGoal);
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

const updateGoal = async (req, res) => {
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

  let newGoal = undefined;
  try {
    newGoal = new Goal(req.body);
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
    await checkIfExists("Goal", newGoal.id, token.id);
    await checkIfNameIsTaken("Goal", newGoal, token.id);
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
    UPDATE GOALS SET
      name = $2,
      description = $3,
      reward = $4
    WHERE id = $1 AND creator_id = $5
    RETURNING *;
    `;
    const values = newGoal.getGoalAsArray();
    const { rows } = await client.query(query, values);
    await client.query("COMMIT");

    newGoal = rows[0];
    console.log(`Successfully updated goal ${newGoal.id}`);
    res.status(200).json(newGoal);
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

const deleteGoal = async (req, res) => {
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

  let goalToDelete = undefined;
  try {
    goalToDelete = new Goal(req.body);
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: "Invalid goal format" });
    return;
  }

  try {
    console.log("deleting", goalToDelete);
    await checkIfExists("Goal", goalToDelete.id, token.id);
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
    const goalId = goalToDelete.id;
    const creatorId = token.id;
    const queryText =
      "DELETE FROM GOALS WHERE id = $1 AND creator_id = $2 RETURNING *;";
    const values = [goalId, creatorId];
    const { rows } = await query(queryText, values);
    console.log(`Successfully deleted goal ${rows[0].id}`);
    await client.query("COMMIT");
    res.status(200).json(rows[0]);
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
  getGoals,
  getGoalById,
  getGoalByName,
  createGoal,
  updateGoal,
  deleteGoal,
};
