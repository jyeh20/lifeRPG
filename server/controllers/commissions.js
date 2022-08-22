import { query } from "../db/index.js";
import { Commission } from "../models/index.js";

// GET

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

const getCommissionsWithUserId = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query(
      `SELECT * FROM COMMISSIONS WHERE creator_id = $1;`,
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// POST

const createCommission = async (req, res) => {
  const commission = new Commission(req.body);
  console.log(commission.name);

  try {
    const { rows } = await query(
      `INSERT into COMMISSIONS (
        creator_id,
        name,
        description,
        freq_week,
        freq_month,
        freq_year,
        difficulty,
        num_times_completed,
        completed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      commission.getCommissionAsArray()
    );

    console.log(`Successfully created commission with id: ${rows[0].id}`);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// PUT

const updateCommission = async (req, res) => {
  const id = Number(req.params.id);
  const updatedCommission = new Commission(req.body);
  try {
    const { rows } = await query(
      `UPDATE COMMISSIONS SET
        creator_id = $1,
        name = $2,
        description = $3,
        freq_week = $4,
        freq_month = $5,
        freq_year = $6,
        difficulty = $7,
        num_times_completed = $8,
        completed = $9
        WHERE id = $10 RETURNING *;`,
      [...updatedCommission.getCommissionAsArray(), id]
    );

    console.log(`Successfully updated commission ${id}`);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE

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

export {
  getCommissions,
  getCommissionById,
  getCommissionsWithUserId,
  createCommission,
  updateCommission,
  deleteCommission,
};
