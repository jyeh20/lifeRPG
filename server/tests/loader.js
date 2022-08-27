import { pool, getNewPool } from "../db/index";
import { User } from "../models/index.js";

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

const initializeItems = async () => {
  console.log("Dropping items table...");
  await pool.query("DROP TABLE IF EXISTS items CASCADE;");
  console.log("Items table dropped.\nCreating items table...");
  await pool.query(`
  CREATE TABLE items (
  id SERIAL,
  name VARCHAR(35) NOT NULL,
  cost INTEGER NOT NULL,
  item_url VARCHAR(255),
  creator_id INTEGER NOT NULL,
  PRIMARY KEY (id, item_url),
  UNIQUE(id),
  UNIQUE(item_url, creator_id),
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);
  `);
  console.log("Items table created.");
};

const loadUsers = async (usersList) => {
  console.log("Loading users...");
  for (let i = 0; i < usersList.length; i++) {
    let user = usersList[i];
    user = new User(user);
    await pool.query(
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
        points,
        admin
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *;
      `,
      user.getUserAsArray()
    );
  }
};

const dropUsers = async () => {
  console.log("Dropping users table...");
  await pool.query("DROP TABLE IF EXISTS users CASCADE;");
  console.log("Users table dropped.");
};

const dropItems = async () => {
  console.log("Dropping items table...");
  await pool.query("DROP TABLE IF EXISTS items CASCADE;");
  console.log("Items table dropped.");
};

const endPool = async () => {
  await pool.end();
};

const startPool = async () => {
  await getNewPool();
};

const start = async (users) => {
  await initializeUsers();
  await loadUsers(users);
  await initializeItems();
};

const end = async () => {
  await dropUsers();
  await dropItems();
  await endPool();
};

export {
  initializeUsers,
  initializeItems,
  loadUsers,
  dropUsers,
  dropItems,
  endPool,
  startPool,
  start,
  end,
};
