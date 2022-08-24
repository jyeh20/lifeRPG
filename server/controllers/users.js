import dotenv from "dotenv";
import { pool, query } from "../db/index.js";
import { User } from "../models/index.js";
import { generateToken, verifyToken } from "../auth/jwt.js";
import bcrypt from "bcrypt";

const nodeEnv = process.env.NODE_ENV || "development";

switch (nodeEnv) {
  case "production":
    dotenv.config({ path: "../config/config.prod.env" });
    break;
  case "test":
    dotenv.config({ path: "../config/config.test.env" });
    break;
  default:
    dotenv.config({ path: "../config/config.dev.env" });
}

/**
 * @description - This function is used to get all users in the database
 * @param {object} request - The request object
 * @param {object} response - The response object
 */
const getUsers = async (req, res) => {
  const token = verifyToken(req.headers.authorization);
  if (!token.admin) {
    res.status(403).json({ error: "This account is not authorized" });
    return;
  }
  try {
    const { rows } = await query("SELECT * FROM USERS;");
    res.status(200).json(rows);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    return;
  }
};

const getSelfById = async (req, res) => {
  const { id } = verifyToken(req.headers.authorization);

  if (!id) {
    res.status(403).json({ error: "This account is not authorized" });
  }

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

const getSelfByUsername = async (req, res) => {
  const { username } = verifyToken(req.headers.authorization);

  if (!username) {
    res.status(403).json({ error: "This account is not authorized" });
  }

  try {
    const { rows } = await query("SELECT * FROM USERS WHERE username = $1;", [
      username,
    ]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description - This function is used to create a user in the database and logs the new user's ID
 * @param {object} request - The request object
 * @param {object} response - The response object
 */
const createUser = async (req, res) => {
  let user = {};
  try {
    user = new User(req.body);
  } catch (error) {
    if (error.code === 400) {
      console.log(error);
      res.status(400).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }

  const client = await pool.connect();

  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.SALT_ROUNDS)
    );

    await client.query("BEGIN;");
    const query = `
      INSERT INTO USERS (
        first_name,
        last_name,
        username,
        birthday,
        email,
        password,
        daily_reward,
        weekly_reward,
        monthly_reward,
        yearly_reward,
        max_commissions_day,
        max_commissions_week,
        max_commissions_month,
        max_commissions_year,
        points,
        admin
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *;
      `;
    const values = user.getUserAsArray().filter((prop) => prop !== undefined);

    const { rows } = await client.query(query, values);

    const token = generateToken({ ...user.getUser(), id: rows[0].id });

    console.log(`Successfully created user with id: ${rows[0].id}`);
    await client.query("COMMIT;");
    res.status(201).json(token);
  } catch (error) {
    await client.query("ROLLBACK;");
    res.status(500).json({ errorCode: error.code, error: error.message });
  } finally {
    client.release();
  }
};

const getUserWithEmailLogin = async (req, res) => {
  const { email, password } = req.body;
  let user = undefined;

  try {
    const { rows } = await query("SELECT * FROM USERS WHERE email = $1;", [
      email,
    ]);
    if (rows.length !== 0) {
      user = rows;
    }

    if (user) {
      user = user[0];
      // try login
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid) {
        const token = generateToken(user);
        res.status(200).json(token);
        return;
      } else {
        res.status(401).json({ error: "Invalid password" });
        return;
      }
    } else {
      res.status(401).json({ error: "Invalid email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserWithUsernameLogin = async (req, res) => {
  const { username, password } = req.body;
  let user = undefined;

  try {
    // check if input is a username
    const { rows } = await query(`SELECT * FROM USERS WHERE username = $1;`, [
      username,
    ]);
    if (rows.length !== 0) {
      user = rows;
    }

    if (user) {
      user = user[0];
      // try login
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid) {
        const token = generateToken(user);
        res.status(200).json(token);
        return;
      } else {
        res.status(401).json({ error: "Invalid password" });
        return;
      }
    } else {
      res.status(401).json({ error: "Invalid username" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateSelf = async (req, res) => {
  const { id } = verifyToken(req.headers.authorization);
  let updatedUser = {};
  try {
    updatedUser = new User(req.body);
  } catch (error) {
    if (error.code === 400) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
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
        points = $15
      WHERE id = $16 RETURNING *;
      `;

    const values = [...updatedUser.getUserAsArray().slice(0, 1), id];
    const { rows } = await client.query(query, values);
    await client.query("COMMIT;");

    console.log(`Successfully updated user ${id}`);
    res.status(200).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK;");
    console.log(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

const deleteSelf = async (req, res) => {
  const { id } = verifyToken(req.headers.authorization);

  const client = await pool.connect();

  try {
    await client.query("BEGIN;");

    const query = `DELETE FROM USERS WHERE id = $1 RETURNING *;`;
    const values = [id];

    const { rows } = await client.query(query, values);
    res.status(200).json(`User deleted with ID: ${id}`);
  } catch (error) {
    await client.query("ROLLBACK;");
    console.log(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Admin

const getUserById = async (req, res) => {
  const { admin } = verifyToken(req.headers.authorization);

  if (!admin) {
    res.status(403).json({ error: "You are not authorized to do this" });
    return;
  }

  const { id } = req.params;
  try {
    const { rows } = await query("SELECT * FROM USERS WHERE id = $1;", [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "User does not exist" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const { admin } = verifyToken(req.headers.authorization);

  if (!admin) {
    res.status(403).json({ error: "You are not authorized to do this" });
    return;
  }

  let updatedUser = {};
  try {
    updatedUser = new User(req.body);
  } catch (error) {
    if (error.code === 400) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
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
        points = $15
      WHERE id = $16 RETURNING *;
      `;

    const values = [...updatedUser.getUserAsArray(), id];
    const { rows } = await client.query(query, values);
    await client.query("COMMIT;");

    console.log(`Successfully updated user ${id}`);
    res.status(200).json(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK;");
    console.log(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  const { admin } = verifyToken(req.headers.authorization);

  if (!admin) {
    res.status(403).json({ error: "You are not authorized to do this" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN;");

    const query = `DELETE FROM USERS WHERE id = $1 RETURNING *;`;
    const values = [id];

    const { rows } = await client.query(query, values);
    res.status(200).json(`User deleted with ID: ${id}`);
  } catch (error) {
    await client.query("ROLLBACK;");
    console.log(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export {
  getUsers,
  getSelfById,
  getSelfByUsername,
  createUser,
  getUserWithEmailLogin,
  getUserWithUsernameLogin,
  updateSelf,
  deleteSelf,
  getUserById,
  updateUser,
  deleteUser,
};
