/* istanbul ignore file */
import { query } from "../db/index.js";
const checkIfUserExists = async (user, userId) => {
  const queryText = "SELECT * FROM USERS WHERE id = $1;";
  const values = [userId];
  const res = await query(queryText, values);
  if (res.rows.length === 0) {
    const e = new Error("User does not exist");
    e.code = 404;
    throw e;
  }
};

const checkIfUsernameOrEmailIsTaken = async (user, userId) => {
  const queryText = "SELECT * FROM USERS WHERE username = $1 OR email = $2;";
  const values = [user.username, user.email];
  const res = await query(queryText, values);
  let error = undefined;
  if (userId) {
    if (res.rows.length != 0 && res.rows[0].id != userId) {
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

const checkIfItemExists = async (itemId, creatorId) => {
  const queryText = "SELECT * FROM ITEMS WHERE id = $1 AND creator_id = $2";
  const values = [itemId, creatorId];
  const res = await query(queryText, values);
  if (res.rows.length === 0) {
    const e = new Error("Could not find item with provided ID");
    e.code = 404;
    throw e;
  }
};

const checkIfItemNameIsTaken = async (item, creatorId) => {
  const queryText = "SELECT * FROM ITEMS WHERE name = $1 AND creator_id = $2";
  const values = [item.name, creatorId];
  const res = await query(queryText, values);
  if (res.rows.length != 0 && res.rows[0].id != item.id) {
    const e = new Error("Item by that name already exists");
    e.code = 409;
    throw e;
  }
};

const checkIfCommissionExists = async (commissionId, creatorId) => {
  const queryText =
    "SELECT * FROM COMMISSIONS WHERE id = $1 AND creator_id = $2";
  const values = [commissionId, creatorId];
  const res = await query(queryText, values);
  if (res.rows.length === 0) {
    const e = new Error("Could not find commission with provided ID");
    e.code = 404;
    throw e;
  }
};

const checkIfCommissionNameIsTaken = async (commission, creatorId) => {
  const queryText =
    "SELECT * FROM COMMISSIONS WHERE name = $1 AND creator_id = $2";
  const values = [commission.name, creatorId];
  const res = await query(queryText, values);
  if (res.rows.length != 0 && res.rows[0].id != commission.id) {
    const e = new Error("Commission by that name already exists");
    e.code = 409;
    throw e;
  }
};

export {
  checkIfUserExists,
  checkIfUsernameOrEmailIsTaken,
  checkIfItemExists,
  checkIfItemNameIsTaken,
  checkIfCommissionExists,
  checkIfCommissionNameIsTaken,
};
