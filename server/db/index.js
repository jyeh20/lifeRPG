/**
 * Credit: https://node-postgres.com/guides/project-structure
 */

import dotenv from "dotenv";
import pg from "pg";

const Pool = pg.Pool;
const Client = pg.Client;
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

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const query = async (sql, params) => {
  const start = Date.now();
  const result = await pool.query(sql, params);
  const duration = Date.now() - start;
  console.log(`\nQuery ${sql} took ${duration}ms\n`);
  return result;
};

const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  const timeout = setTimeout(() => {
    console.error("Client has been checked out for too long");
    console.error(
      `Last executed query on this client was: ${client.lastQuery}`
    );
  }, 5000);

  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);

    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

export { pool, query, getClient };
