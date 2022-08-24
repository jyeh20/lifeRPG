import app from "../../app";
import supertest from "supertest";
import { initializeUsers, dropUsers } from "./loader.js";
import { verifyToken } from "../../auth/jwt.js";
let admin = "";
let user = "";
let user6 = "";

const adminData = {
  first_name: "John",
  last_name: "Doe",
  username: "jdoe",
  birthday: "2000-01-01",
  email: "john@doe.com",
  password: "password",
  daily_reward: 5,
  weekly_reward: 10,
  monthly_reward: 20,
  yearly_reward: 50,
  max_commissions_day: 5,
  max_commissions_week: 3,
  max_commissions_month: 3,
  max_commissions_year: 3,
  points: 0,
  admin: true,
};

const userData = {
  first_name: "Jane",
  last_name: "Doe",
  username: "janedoe",
  birthday: "2000-01-01",
  email: "jane@doe.com",
  password: "password",
  daily_reward: 5,
  weekly_reward: 10,
  monthly_reward: 20,
  yearly_reward: 50,
  max_commissions_day: 5,
  max_commissions_week: 3,
  max_commissions_month: 3,
  max_commissions_year: 3,
  points: 0,
  admin: false,
};

const user6Data = {
  first_name: "John",
  last_name: "Smith",
  username: "test6",
  email: "test6@test.com",
  password: "password",
};

beforeAll(async () => {
  return initializeUsers();
});
afterAll(async () => {
  return dropUsers();
});

const request = supertest(app);

describe("Create Users", () => {
  it("Creates an admin user with all fields filled", async () => {
    const res = await request.post("/users").send(adminData);
    expect(res.status).toBe(201);
    admin = res.body;
    return;
  });
  it("Verifies new user using admin key", async () => {
    const res = await request.get("/users").set("Authorization", admin);
    const firstUser = res.body[0];
    expect(res.status).toBe(200);
    expect(firstUser.id).toBe(1);
    expect(firstUser.admin).toBe(true);
  });
  it("Creates a normal user with all fields filled", async () => {
    const res = await request.post("/users").send(userData);
    expect(res.status).toBe(201);
    user = res.body;
  });
  it("Verifies users using user key", async () => {
    const res = await request.get("/users").set("Authorization", user);
    expect(res.status).toBe(403);
  });
  it("Creates a normal user without required fields", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "johnsmith",
      email: "john@smith.com",
      password: "password",
    });
    expect(res.status).toBe(200);
  });
  it("Creates a normal user missing required email field", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jaytay",
      birthday: "2000-01-01",
    });
    expect(res.status).toBe(400);
  });
  it("Creates a normal user with daily reward larger than small int", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jaytay",
      birthday: "2000-01-01",
      email: "jay@tay.com",
      daily_reward: 32777,
    });
    expect(res.status).toBe(413);
  });
  it("Creates user with duplicate username", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jdoe",
      birthday: "2000-01-01",
      email: "test@joe.com",
    });
    expect(res.status).toBe(409);
  });
  it("Checking if db rollback succeeded", async () => {
    const res = await request.get("/users").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
  it("Checking if last user has id 3", async () => {
    const res = await request.get("/admin/users/3").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe("johnsmith");
  });
  it("Adding user 4", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "test4",
      email: "test4@test.com",
      password: "password",
    });
    expect(res.status).toBe(201);
  });
  it("Adding user 5", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "test5",
      email: "test5@test.com",
      password: "password",
    });
    expect(res.status).toBe(201);
  });
  it("Adding user 6", async () => {
    const res = await request.post("/users").send(user6Data);
    expect(res.status).toBe(201);
    user6 = res.body;
  });
  it("Adding user 7", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "test7",
      email: "test7@test.com",
      password: "password",
    });
    expect(res.status).toBe(201);
  });
});

describe("Get Users", () => {
  it("Get users as admin", async () => {
    const res = await request.get("/users").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(7);
  });
  it("Get users as user", async () => {
    const res = await request.get("/users").set("Authorization", user);
    expect(res.status).toBe(403);
  });
});

describe("Get Users by ID", () => {
  it("Get user by id with no token", async () => {
    const res = await request.get("/users/self").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Get user by id with user token", async () => {
    const res = await request.get("/users/self").set("Authorization", user);
    expect(res.status).toBe(200);
    const queriedUser = res.body;
    expect(queriedUser.id).toBe(2);
    expect(queriedUser.username).toBe(userData.username);
  });
});

describe("Get Users by username", () => {
  it("Get user by username with no token", async () => {
    const res = await request.get("/users/username").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Get user by username with user token", async () => {
    const res = await request.get("/users/username").set("Authorization", user);
    expect(res.status).toBe(200);
    const queriedUser = res.body;
    expect(queriedUser.id).toBe(2);
    expect(queriedUser.username).toBe(userData.username);
  });
});

describe("Login Users with email", () => {
  it("Login user with email", async () => {
    const res = await request.post("/users/login/email").send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.status).toBe(200);
    const userToken = verifyToken(res.body);
    const correctToken = verifyToken(user);
    expect(userToken.id).toBe(correctToken.id);
    expect(userToken.username).toBe(correctToken.username);
  });
  it("Login user with wrong email", async () => {
    const res = await request.post("/users/login/email").send({
      email: "fake@email.com",
      password: userData.password,
    });
    expect(res.status).toBe(401);
  });
  it("Login user with wrong password", async () => {
    const res = await request.post("/users/login/email").send({
      email: userData.email,
      password: "fakepassword",
    });
    expect(res.status).toBe(401);
  });
});

describe("Login Users with username", () => {
  it("Login user with username", async () => {
    const res = await request.post("/users/login/username").send({
      username: userData.username,
      password: userData.password,
    });
    expect(res.status).toBe(200);
    const userToken = verifyToken(res.body);
    const correctToken = verifyToken(user);
    expect(userToken.id).toBe(correctToken.id);
    expect(userToken.username).toBe(correctToken.username);
  });
  it("Login user with wrong username", async () => {
    const res = await request.post("/users/login/username").send({
      username: "fakeusername",
      password: userData.password,
    });
    expect(res.status).toBe(401);
  });
  it("Login user with wrong password", async () => {
    const res = await request.post("/users/login/username").send({
      username: userData.username,
      password: "fakepassword",
    });
    expect(res.status).toBe(401);
  });
});

describe("Update Users", () => {
  // TODO: Update user
  // TODO: Update user to username that already exists
  // TODO: Update user to email that already exists
  // TODO: Update reward to out of bounds
  // TODO: Update reward to negative
});

describe("Delete User", () => {
  // TODO: Delete user with no token
  // TODO: Delete user with token
});
