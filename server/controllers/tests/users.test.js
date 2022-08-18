import app from "../../app";
import supertest from "supertest";
import pkg from "pg";

const Pool = pkg.Pool;
dotenv.config({ path: "../../env/.env.testing" });
