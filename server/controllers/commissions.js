import dotenv from "dotenv";
import pkg from "pg";

const Pool = pkg.Pool;
dotenv.config({ path: "../env/.env.testing" });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.PASS,
});
