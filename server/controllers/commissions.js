import { query } from "../db/index.js";

const getCommissions = async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM COMMISSIONS;");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getCommissionById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query("SELECT * FROM COMMISSIONS WHERE id = $1;", [
      id,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createCommission = async (req, res) => {
  const {
    name,
    description,
    freqWeek,
    freqMonth,
    freqYear,
    difficulty,
    creatorId,
  } = req.body;

  try {
    const { rows } = await query(
      `INSERT into COMMISSIONS (
        name, description, freq_week, freq_month, freq_year, difficulty, creator_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [
        name,
        description,
        freqWeek || 0,
        freqMonth || 0,
        freqYear || 0,
        difficulty || 1,
        creatorId,
      ]
    );
    res.status(200).json(`Created commission with id ${rows[0].id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCommission = async (req, res) => {
  const id = Number(req.params.id);
  const {
    name,
    description,
    freqWeek,
    freqMonth,
    freqYear,
    difficulty,
    numTimesCompleted,
    completed,
    creatorId,
  } = req.body;
  try {
    const { rows } = await query(
      `UPDATE COMMISSIONS SET
        name = $1,
        description = $2,
        freq_week = $3,
        freq_month = $4,
        freq_year = $5,
        difficulty = $6,
        num_times_completed = $7,
        completed = $8,
        creator_id = $9
        WHERE id = $10 RETURNING *;`,
      [
        name,
        description,
        freqWeek,
        freqMonth,
        freqYear,
        difficulty,
        numTimesCompleted,
        completed,
        creatorId,
        id,
      ]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCommission = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query(
      `DELETE FROM COMMISSIONS WHERE id = $1 RETURNING *;`,
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// TODO: add a function to get all commissions for a user with user ID

export {
  getCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
};
