import { query } from "../db/index.js";

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

const createGoal = async (req, res) => {
  const { name, description, reward, creator } = req.body;

  try {
    const { rows } = await query(
      `INSERT into GOALS (
        name, description, reward, creator
      ) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [name, description, reward, creator]
    );
    res.status(200).json(`Created goal with id ${rows[0].id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateGoal = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, reward, creator } = req.body;

  try {
    const { rows } = await query(
      `UPDATE GOALS SET
        name = $1,
        description = $2,
        reward = $3,
        creator = $4
      WHERE id = $5 RETURNING *;`,
      [name, description, reward, creator, id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

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

// TODO: add a function to get all goals for a user with user ID

export { getGoals, getGoalById, createGoal, updateGoal, deleteGoal };
