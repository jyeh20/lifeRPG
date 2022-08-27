import { pool, query } from "../db/index.js";
import { User } from "../models/index.js";
import { verifyToken } from "../auth/jwt.js";

const getUserById = async (req, res) => {
  let admin = undefined;
  try {
    admin = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
    return;
  }

  if (!admin.admin) {
    res.status(403).json({ error: "You are not authorized to do this" });
    return;
  }

  const { id } = req.params;
  try {
    const { rows } = await query("SELECT * FROM USERS WHERE id = $1;", [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "User does not exist" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  let admin = undefined;
  try {
    admin = verifyToken(req.headers.authorization);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
    return;
  }

  if (!admin.admin) {
    res.status(403).json({ error: "You are not authorized to do this" });
    return;
  }

  let updatedUser = {};
  try {
    updatedUser = new User(req.body);
  } catch (error) {
    if (error.code === 403) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }

  try {
    await getUserExists(updatedUser, id);
  } catch (error) {
    console.log(error);
    if (error.code === 409) {
      res.status(409).json({ error: "Duplicate entry" });
      return;
    }
    if (error.code === 404) {
      res.status(error.code).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: error.message });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN;");

    const query = `
      UPDATE USERS SET
        first_name = $1,
        last_name = $2,
        username = $3,
        birthday = $4,
        email = $5,
        password = $6,
        daily_reward = $7,
        weekly_reward = $8,
        monthly_reward = $9,
        yearly_reward = $10,
        max_commissions_day = $11,
        max_commissions_week = $12,
        max_commissions_month = $13,
        max_commissions_year = $14,
        points = $15,
        admin = $16
      WHERE id = $17 RETURNING *;
      `;

    const values = [...updatedUser.getUserAsArray().slice(1), id];
    const { rows } = await client.query(query, values);
    await client.query("COMMIT;");

    console.log(`Successfully updated user ${id}`);
    res.status(200).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK;");
    console.log(error);
    if (error.message.includes("out of range")) {
      res.status(403).json({ error: "Invalid input is out of range" });
      return;
    }
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

const deleteUser = async (req, res) => {
  let client = undefined;
  try {
    client = await pool.connect();

    const id = Number(req.params.id);
    const token = verifyToken(req.headers.authorization);

    if (!token.admin) {
      /* istanbul ignore next */
      res.status(403).json({ error: "You are not authorized to do this" });
      /* istanbul ignore next */
      return;
    }

    await client.query("BEGIN;");

    const query = `DELETE FROM USERS WHERE id = $1 RETURNING *;`;
    const values = [id];

    const { rows } = await client.query(query, values);
    res.status(200).json(rows[0].id);
  } catch (error) {
    await client.query("ROLLBACK;");
    /* istanbul ignore else */
    if (error.message === "jwt must be provided") {
      res.status(401).json({ error: error.message });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export { getUserById, updateUser, deleteUser };
