import app from "../../app";
import supertest from "supertest";
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
