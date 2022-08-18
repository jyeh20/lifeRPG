import { query } from "../db/index.js";

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
    res.status(200).json(results.rows);
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
        max_commissions_year
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING *;
      `,
      [
        firstName,
        lastName,
        username,
        birthday || null,
        email,
        password,
        dailyReward || 5,
        weeklyReward || 5,
        monthlyReward || 5,
        yearlyReward || 5,
        maxCommissionsDay || 5,
        maxCommissionsWeek || 3,
        maxCommissionsMonth || 3,
        maxCommissionsYear || 3,
      ]
    );
    res.status(200).json(`Created user with id ${rows[0].id}`);
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

export { getUsers, getUserById, createUser, updateUser, deleteUser };
