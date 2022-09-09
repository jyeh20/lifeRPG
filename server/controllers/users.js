import dotenv from "dotenv";
import { pool, query } from "../db/index.js";
import { User } from "../models/index.js";
import { generateToken, verifyToken } from "../auth/jwt.js";
import { checkIfExists, checkIfNameIsTaken } from "./helpers.js";
import bcrypt from "bcrypt";

/* istanbul ignore next */
const nodeEnv = process.env.NODE_ENV || "development";

/* istanbul ignore next */
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

const getUserWithToken = async (req, res) => {
  let token = undefined;

  if (!req.headers.authorization) {
    res.status(401).json({ error: "jwt must be provided" });
    return;
  }

  try {
    token = verifyToken(req.headers.authorization);
  } catch (error) {
    res.status(401).json({ error: error.message });
    return;
  }
  try {
    const id = token.id;

    const { rows } = await query("SELECT * FROM USERS WHERE id = $1;", [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "User does not exist" });
      return;
    }
    if (token.username != rows[0].username) {
      res
        .status(403)
        .json({ error: "You do not have permission to view this" });
      return;
    }
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
    console.log(error);
    res.status(error.code).json({ error: error.message });
    return;
  }

  try {
    await checkIfNameIsTaken("User", user);
  } catch (error) {
    console.log(error);
    res.status(error.code).json({ error: error.message });
    return;
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
    /* istanbul ignore else */
    if (error.message.includes("is out of range for type")) {
      res.status(403).json({ error: "Invalid input" });
      return;
    }
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    console.log(error);
    /* istanbul ignore next */
    res.status(500).json({ error: error.message });
  }
};

const updateSelf = async (req, res) => {
  let jwt = undefined;
  let token = undefined;
  try {
    jwt = req.headers.authorization;
    token = verifyToken(jwt);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
    return;
  }
  let updatedUser = {};
  try {
    updatedUser = new User(req.body);
  } catch (error) {
    /* istanbul ignore else */
    if (error.code === 403) {
      res.status(403).json({ error: error.message });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: error.message });
  }

  try {
    await checkIfExists("User", token.id);
    await checkIfNameIsTaken("User", updatedUser, token.id);
  } catch (error) {
    console.log(error);
    /* istanbul ignore else */
    if (error.code === 409) {
      res.status(409).json({ error: "Duplicate entry" });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: error.message });
    /* istanbul ignore next */
    return;
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

    const id = token.id;
    const values = [...updatedUser.getUserAsArray().slice(1, -1), id];
    const { rows } = await client.query(query, values);
    await client.query("COMMIT;");

    console.log(`Successfully updated user ${id}`);
    res.status(200).json(jwt);
  } catch (error) {
    await client.query("ROLLBACK;");
    console.log(error);
    /* istanbul ignore else */
    if (error.message.includes("out of range")) {
      res.status(403).json({ error: "Invalid input is out of range" });
      return;
    }
    /* istanbul ignore next */
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

const deleteSelf = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = verifyToken(req.headers.authorization);

    await client.query("BEGIN;");

    const query = `DELETE FROM USERS WHERE id = $1 RETURNING *;`;
    const values = [id];

    const { rows } = await client.query(query, values);

    client.query("COMMIT;");
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

export {
  getUserWithToken,
  createUser,
  getUserWithEmailLogin,
  getUserWithUsernameLogin,
  updateSelf,
  deleteSelf,
};
