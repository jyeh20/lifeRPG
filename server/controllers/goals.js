import { query } from "../db/index.js";
import { Goal } from "../models/index.js";

// GET

const getGoals = async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM GOALS;");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getGoalById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query("SELECT * FROM GOALS WHERE id = $1;", [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getGoalsWithUserId = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query("SELECT * FROM GOALS WHERE creator_id = $1;", [
      id,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// POST

const createGoal = async (req, res) => {
  const goal = new Goal(req.body);

  try {
    const { rows } = await query(
      `INSERT into GOALS (
        creator, name, description, reward,
      ) VALUES ($1, $2, $3, $4) RETURNING *;`,

      goal.getGoalAsArray()
    );
    res.status(200).json(`Created goal with id ${rows[0].id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// PUT

const updateGoal = async (req, res) => {
  const id = Number(req.params.id);
  const updatedGoal = new Goal(req.body);

  try {
    const { rows } = await query(
      `UPDATE GOALS SET
        creator = $1,
        name = $2,
        description = $3,
        reward = $4
      WHERE id = $5 RETURNING *;`,
      [...updatedGoal.getGoalAsArray, id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE

const deleteGoal = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query("DELETE FROM GOALS WHERE id = $1;", [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getGoals,
  getGoalById,
  getGoalsWithUserId,
  createGoal,
  updateGoal,
  deleteGoal,
};
