import axios from "axios";

const API_URL = `http://localhost:3001`;

const create = async (token, route, incomingData = {}) => {
  const config = {
    headers: { Authorization: token },
  };
  const data = {
    ...incomingData,
  };
  const res = await axios
    .post(`${API_URL}/${route}`, data, config)
    .catch((e) => {
      console.log("Error in creating item", e);
      return undefined;
    });
  return res;
};

const getAll = async (token, route, incomingData = {}) => {
  const config = {
    headers: { Authorization: token },
  };
  const data = {
    ...incomingData,
  };
  const res = await axios
    .get(`${API_URL}/${route}`, data, config)
    .catch((e) => {
      console.log("Error in getting items", e);
      return undefined;
    });
  return res;
};

const getById = async (token, route, id) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios
    .get(`${API_URL}/${route}/id/${id}`, config)
    .catch((e) => {
      console.log("Error in getting item by id", e);
      return undefined;
    });
  return res;
};

const getByName = async (token, route, name) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios
    .get(`${API_URL}/${route}/name/${name}`, config)
    .catch((e) => {
      console.log("Error in getting item by name", e);
      return undefined;
    });
  return res;
};

const update = async (token, route, incomingData = {}) => {
  const config = {
    headers: { Authorization: token },
  };
  const data = {
    ...incomingData,
  };
  const res = await axios
    .put(`${API_URL}/${route}`, data, config)
    .catch((e) => {
      console.log("Error in updating item", e);
      return undefined;
    });
  return res;
};

const remove = async (token, route, id) => {
  const config = {
    headers: { Authorization: token },
  };
  const data = {
    id,
  };
  const res = await axios
    .delete(`${API_URL}/${route}`, data, config)
    .catch((e) => {
      console.log("Error in deleting item", e);
      return undefined;
    });
  return res;
};

const getUserWithToken = async (token) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.get(`${API_URL}/users`, config).catch((e) => {
    console.log("Error in getting user with token", e);
    return undefined;
  });
  return res;
};

const emailLogin = async (email, password) => {
  const data = {
    email,
    password,
  };

  const res = await axios
    .post(`${API_URL}/users/login/email`, data)
    .catch((e) => {
      console.log("Error in logging in with email", e);
      return undefined;
    });
  return res;
};

const usernameLogin = async (username, password) => {
  const data = {
    username,
    password,
  };

  const res = await axios
    .post(`${API_URL}/users/login/username`, data)
    .catch((e) => {
      console.log("Error in logging in with username", e);
      return undefined;
    });
  return res;
};

export {
  create,
  getAll,
  getById,
  getByName,
  update,
  remove,
  emailLogin,
  usernameLogin,
  getUserWithToken,
};
