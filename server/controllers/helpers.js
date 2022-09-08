/* istanbul ignore file */
import { query } from "../db/index.js";
const checkIfUserExists = async (tokenId) => {
  const queryText = "SELECT * FROM USERS WHERE id = $1;";
  const values = [tokenId];
  const res = await query(queryText, values);
  if (res.rows.length === 0) {
    const e = new Error("User does not exist");
    e.code = 404;
    throw e;
  }
};

const checkIfUsernameOrEmailIsTaken = async (user, tokenId) => {
  const queryText = "SELECT * FROM USERS WHERE username = $1 OR email = $2;";
  const values = [user.username, user.email];
  const res = await query(queryText, values);
  let error = undefined;
  if (tokenId) {
    if (res.rows.length != 0 && res.rows[0].id != tokenId) {
      error = new Error("Username or email is already taken");
      error.code = 409;
    }
  } else {
    if (res.rows.length != 0) {
      error = new Error("Username or email is already taken");
      error.code = 409;
    }
  }
  if (error) {
    throw error;
  }
};

const checkIfExists = async (type, id, creatorId) => {
  switch (type) {
    case "User":
      await checkIfUserExists(id);
      break;
    default:
      const queryText = `SELECT * FROM ${type.toUpperCase()}S WHERE id = $1 AND creator_id = $2`;
      const values = [id, creatorId];
      const res = await query(queryText, values);
      if (res.rows.length === 0) {
        const e = new Error(`Could not find ${type} with provided ID`);
        e.code = 404;
        throw e;
      }
  }
};

const checkIfNameIsTaken = async (type, object, creatorId) => {
  switch (type) {
    case "User":
      await checkIfUsernameOrEmailIsTaken(object, creatorId);
      break;
    default:
      const queryText = `SELECT * FROM ${type.toUpperCase()}S WHERE name = $1 AND creator_id = $2`;
      const values = [object.name, creatorId];
      const res = await query(queryText, values);
      if (res.rows.length != 0 && res.rows[0].id != object.id) {
        const e = new Error(`${type} by that name already exists`);
        e.code = 409;
        throw e;
      }
  }
};

export {
  checkIfUserExists,
  checkIfUsernameOrEmailIsTaken,
  checkIfExists,
  checkIfNameIsTaken,
};
