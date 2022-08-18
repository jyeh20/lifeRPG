import dotenv from "dotenv";
import pkg from "pg";

const Pool = pkg.Pool;
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
console.log(process.env.SERVER_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

/**
 * @description - This function is used to get all users in the database
 * @param {object} request - The request object
 * @param {object} response - The response object
 */
const getUsers = (req, res) => {
  console.log(pool);
  pool.query("SELECT * FROM USERS ORDER BY id ASC;", (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  pool.query("SELECT * FROM USERS WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

/**
 * @description - This function is used to create a user in the database and logs the new user's ID
 * @param {object} request - The request object
 * @param {object} response - The response object
 */
const createUser = (req, res) => {
  const {
    name,
    username,
    birthday,
    email,
    password,
    maxCommissionsWeek,
    maxCommissionsMonth,
    maxCommissionsYear,
  } = req.body;

  pool.query(
    `INSERT into USERS (
        name, username, birthday, email, password, max_commissions_week, max_commissions_month, max_commissions_year
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
    [
      name,
      username,
      birthday || "NULL",
      email,
      password,
      maxCommissionsWeek,
      maxCommissionsMonth,
      maxCommissionsYear,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res
        .status(201)
        .json(console.log(`Created user with id ${results.rows[0]}`));
    }
  );
};

const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const {
    name,
    username,
    birthday,
    email,
    password,
    maxCommissionsWeek,
    maxCommissionsMonth,
    maxCommissionsYear,
  } = req.body;

  pool.query(
    "UPDATE USERS SET name=$1, username=$2, birthday=$3, email=$4, password=$5, max_commissions_week=$6, max_commissions_month=$7, max_commissions_year=$8 WHERE id=$9;",
    [
      name,
      username,
      birthday || "NULL",
      email,
      password,
      maxCommissionsWeek,
      maxCommissionsMonth,
      maxCommissionsYear,
      id,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = Number(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
