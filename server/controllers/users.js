import dotenv from "dotenv";
import { query } from "../db/index.js";
import { UserModel } from "../models/index.js";
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
  try {
    const { rows } = await query("SELECT * FROM USERS;");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { rows } = await query("SELECT * FROM USERS WHERE id = $1;", [id]);
    res.status(200).json(rows);
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
  const user = new UserModel(req.body);

  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.SALT_ROUNDS)
    );

    const { rows } = await query(
      `
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
        points
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *;
      `,
      user.getUser()
    );
    console.log(rows);
    res.status(200).json(`Created user with id ${rows[0].id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserWithLogin = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = undefined;

  try {
    // check if input is a username
    const { username } = await query("SELECT * FROM USERS WHERE username=$1;", [
      usernameOrEmail,
    ]);
    if (username) {
      user = username;
    } else {
      const { email } = await query("SELECT * FROM USERS WHERE email=$1;", [
        usernameOrEmail,
      ]);
      if (email) {
        user = email;
      }
    }

    if (user) {
      // try login
      const comparedPassword = await bcrypt.compare(password, user.password);
      if (comparedPassword) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ error: "Invalid password" });
      }
    } else {
      res.status(400).json({ error: "Invalid username or email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const {
    firstName,
    lastName,
    username,
    birthday,
    email,
    password,
    dailyReward,
    weeklyReward,
    monthlyReward,
    yearlyReward,
    maxCommissionsDay,
    maxCommissionsWeek,
    maxCommissionsMonth,
    maxCommissionsYear,
  } = req.body;

  try {
    const { rows } = await query(
      `
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
        max_commissions_year = $14
      WHERE id = $15 RETURNING *;
      `,
      [
        firstName,
        lastName,
        username,
        birthday,
        email,
        password,
        dailyReward,
        weeklyReward,
        monthlyReward,
        yearlyReward,
        maxCommissionsDay,
        maxCommissionsWeek,
        maxCommissionsMonth,
        maxCommissionsYear,
        id,
      ]
    );
    res.status(200).json(`User modified with ID: ${id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (request, response) => {
  const id = Number(request.params.id);

  try {
    const { rows } = await query("DELETE FROM USERS WHERE id=$1 RETURNING *;", [
      id,
    ]);
    response.status(200).json(`User deleted with ID: ${id}`);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  getUserWithLogin,
  updateUser,
  deleteUser,
};
