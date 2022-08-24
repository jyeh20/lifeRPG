import { pool } from "../../db/index";

const initializeUsers = async () => {
  console.log("Dropping users table...");
  await pool.query("DROP TABLE IF EXISTS users CASCADE;");
  console.log("Users table dropped.\nCreating users table...");
  await pool.query(`CREATE TABLE users (
  id SERIAL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(25) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  birthday DATE,
  daily_reward SMALLINT NOT NULL,
  weekly_reward SMALLINT NOT NULL,
  monthly_reward SMALLINT NOT NULL,
  yearly_reward SMALLINT NOT NULL,
  max_commissions_day SMALLINT NOT NULL,
  max_commissions_week SMALLINT NOT NULL,
  max_commissions_month SMALLINT NOT NULL,
  max_commissions_year SMALLINT NOT NULL,
  points INTEGER NOT NULL,
  admin BOOLEAN NOT NULL,
  UNIQUE (username),
  UNIQUE (id),
  UNIQUE (email),
  PRIMARY KEY (id, username)
  );`);
  console.log("Users table created.");
};

const dropUsers = async () => {
  console.log("Dropping users table...");
  await pool.query("DROP TABLE IF EXISTS users CASCADE;");
  console.log("Users table dropped.");
  await pool.end();
};

export { initializeUsers, dropUsers };
