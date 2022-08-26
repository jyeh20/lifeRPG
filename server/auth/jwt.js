import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models";

/* istanbul ignore next */
const nodeEnv = process.env.NODE_ENV || "development";

switch (nodeEnv) {
  /* istanbul ignore next */
  case "production":
    dotenv.config({ path: "../config/config.prod.env" });
    break;
  case "test":
    dotenv.config({ path: "../config/config.test.env" });
    break;
  /* istanbul ignore next */
  default:
    dotenv.config({ path: "../config/config.dev.env" });
}

const generateToken = (user, expiresIn = "1hr") => {
  try {
    const userObj = new User(user);
    return jwt.sign(
      { id: userObj?.id, username: userObj?.username, admin: userObj?.admin },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  } catch (error) {
    /* istanbul ignore next */
    throw error;
  }
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateToken, verifyToken };
