import app from "../app";
import supertest from "supertest";
import * as loader from "./loader.js";
import { generateToken, verifyToken } from "../auth/jwt.js";

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

const user7Data = {
  first_name: "John",
  last_name: "Smith",
  username: "test7",
  email: "test7@test.com",
  password: "password",
};

let admin = generateToken(adminData);
let user = "";
let testUser = "";

beforeAll(async () => {
  return loader.start();
});
afterAll(async () => {
  return loader.end();
});

const request = supertest(app);

describe("createUser", () => {
  it("Creates an admin user with all fields filled", async () => {
    const res = await request.post("/users").send(adminData);
    expect(res.status).toBe(201);
    admin = res.body;
  });
  it("Verifies new user using admin key", async () => {
    const res = await request.get("/admin/users").set("Authorization", admin);
    const firstUser = res.body[0];
    expect(res.status).toBe(200);
    expect(firstUser.id).toBe(1);
    expect(firstUser.admin).toBe(true);
  });
  it("Creates a normal user with all fields filled", async () => {
    const res = await request.post("/users").send(userData);
    expect(res.status).toBe(201);
    user = res.body;
    expect(verifyToken(user).id).toBe(2);
  });
  it("Creates a normal user without required fields", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "johnsmith",
      email: "john@smith.com",
      password: "password",
    });
    expect(res.status).toBe(201);
    expect(verifyToken(res.body).id).toBe(3);
  });
  it("Creates a normal user missing required email field", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jaytay",
      birthday: "2000-01-01",
      password: "password",
    });
    expect(res.status).toBe(403);
  });
  it("Creates a normal user with daily reward larger than small int", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jaytay",
      birthday: "2000-01-01",
      password: "password",
      email: "jay@tay.com",
      daily_reward: 32777,
    });
    expect(res.status).toBe(403);
  });
  it("Creates a normal user with negative daily reward", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jaytay",
      birthday: "2000-01-01",
      password: "password",
      email: "jay@tay.com",
      daily_reward: -1,
    });
    expect(res.status).toBe(403);
  });
  it("Creates user with duplicate username", async () => {
    const res = await request.post("/users").send({
      first_name: "John",
      last_name: "Smith",
      username: "jdoe",
      birthday: "2000-01-01",
      email: "test@joe.com",
      password: "password",
    });
    expect(res.status).toBe(409);
  });
  it("Checking if db rollback succeeded", async () => {
    const res = await request.get("/admin/users").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
  it("Checking if last user has id 3", async () => {
    const res = await request.get("/admin/users/3").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("johnsmith");
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
    expect(verifyToken(res.body).id).toBe(4);
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
    expect(verifyToken(res.body).id).toBe(5);
  });
  it("Adding user 6", async () => {
    const res = await request.post("/users").send(user6Data);
    expect(res.status).toBe(201);
    expect(verifyToken(res.body).id).toBe(6);
  });
  it("Adding user 7", async () => {
    const res = await request.post("/users").send(user7Data);
    expect(res.status).toBe(201);
    testUser = res.body;
    expect(verifyToken(testUser).id).toBe(7);
  });
});

describe("getUsers", () => {
  it("Get users as admin", async () => {
    const res = await request.get("/admin/users").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(7);
  });
  it("Get users as admin with no token", async () => {
    const res = await request.get("/admin/users").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Get users as user", async () => {
    const res = await request.get("/admin/users").set("Authorization", user);
    expect(res.status).toBe(403);
  });
});

describe("getUserWithToken", () => {
  it("Get user by id with no token", async () => {
    const res = await request.get("/users/id").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Get user by id with user token", async () => {
    const res = await request.get("/users/id").set("Authorization", user);
    expect(res.status).toBe(200);
    const queriedUser = res.body;
    expect(queriedUser.id).toBe(2);
    expect(queriedUser.username).toBe(userData.username);
  });
  it("Get user by id with fake token", async () => {
    const fakeToken = generateToken({
      ...user7Data,
      id: 1,
    });
    const res = await request.get("/users/id").set("Authorization", fakeToken);
    expect(res.status).toBe(403);
  });
  it("Get user by id with no id", async () => {
    const fakeToken = generateToken({
      ...user7Data,
      id: undefined,
    });
    const res = await request.get("/users/id").set("Authorization", fakeToken);
    expect(res.status).toBe(401);
  });
  it("Get user by id with nonexistent ID", async () => {
    const fakeToken = generateToken({
      ...user7Data,
      id: 18,
    });
    const res = await request.get("/users/id").set("Authorization", fakeToken);
    expect(res.status).toBe(404);
  });
  it("Crash server", async () => {
    await loader.endPool();
    const res = await request.get("/users/id").set("Authorization", user);
    expect(res.status).toBe(500);
    await loader.startPool();
  });
});

describe("getUserWithEmailLogin", () => {
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

describe("getUserWithUsernameLogin", () => {
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

describe("updateSelf", () => {
  it("Updates user 7 username to test 6 with no token", async () => {
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      username: user6Data.username,
    };
    const res = await request.put("/users").set("Authorization", "").send(user);
    expect(res.status).toBe(401);
  });
  it("Updates user 7 username to test6", async () => {
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      username: user6Data.username,
    };
    const res = await request
      .put("/users")
      .set("Authorization", testUser)
      .send(user);
    expect(res.status).toBe(409);
  });
  it("Updates user 7 email to test", async () => {
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      email: userData.email,
    };
    const res = await request
      .put("/users")
      .set("Authorization", testUser)
      .send(user);
    expect(res.status).toBe(409);
  });
  it("Updates user 7 daily_reward to out of bounds value", async () => {
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      daily_reward: 4000000000,
    };
    const res = await request
      .put("/users")
      .set("Authorization", testUser)
      .send(user);
    expect(res.status).toBe(403);
  });
  it("Updates user 7 daily_reward to negative value", async () => {
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      daily_reward: -1,
    };
    const res = await request
      .put("/users")
      .set("Authorization", testUser)
      .send(user);
    expect(res.status).toBe(403);
  });
  it("Updates user 7 name", async () => {
    // get user
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      first_name: "Jill",
      last_name: "Swan",
    };
    const res = await request
      .put("/users")
      .set("Authorization", testUser)
      .send({
        ...user,
        first_name: "Jill",
        last_name: "Swan",
      });
    expect(res.status).toBe(200);
    const token = res.body;
    expect(token).toBe(testUser);
  });
  it("Updates user 7 back to normal", async () => {
    let user = await request.get("/users/id").set("Authorization", testUser);
    user = user.body;
    user = {
      ...user,
      ...user7Data,
    };
    const res = await request
      .put("/users")
      .set("Authorization", testUser)
      .send(user);
    expect(res.status).toBe(200);
    const token = res.body;
    expect(token).toBe(testUser);
  });
});

describe("updateUser", () => {
  it("Updates user without token", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      username: user6Data.username,
    };
    const res = await request.put("/admin/users/7").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Updates user with non admin token", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      username: user6Data.username,
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", testUser);
    expect(res.status).toBe(403);
  });
  it("Updates user 7 username to test6", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      username: user6Data.username,
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", admin)
      .send(user);
    expect(res.status).toBe(409);
  });
  it("Updates user 7 email to test", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      email: userData.email,
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", admin)
      .send(user);
    expect(res.status).toBe(409);
  });
  it("Updates user 7 daily_reward to out of bounds value", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      daily_reward: 4000000000,
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", admin)
      .send(user);
    expect(res.status).toBe(403);
  });
  it("Updates user 7 daily_reward to negative value", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      daily_reward: -1,
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", admin)
      .send(user);
    expect(res.status).toBe(403);
  });
  it("Updates user 7 name", async () => {
    // get user
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      first_name: "Jill",
      last_name: "Swan",
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", admin)
      .send(user);
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(user);
  });
  it("Updates user 7 back to normal", async () => {
    let user = await request.get("/admin/users/7").set("Authorization", admin);
    user = user.body;
    user = {
      ...user,
      ...user7Data,
    };
    const res = await request
      .put("/admin/users/7")
      .set("Authorization", admin)
      .send(user);
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(user);
  });
  it("Updates user that doesn't exist", async () => {
    const res = await request
      .put("/admin/users/18")
      .set("Authorization", admin)
      .send(adminData);
    expect(res.status).toBe(404);
  });
  it("Crash server", async () => {
    await loader.endPool();
    const res = await request.put("/admin/users/7").set("Authorization", admin);
    expect(res.status).toBe(500);
    await loader.startPool();
  });
});

describe("deleteSelf", () => {
  it("Deletes user without token", async () => {
    const res = await request.delete("/users").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Crashes server", async () => {
    await loader.endPool();
    const res = await request.delete("/users").set("Authorization", testUser);
    expect(res.status).toBe(500);
    await loader.startPool();
  });
  it("Deletes user with user token", async () => {
    const res = await request.delete("/users").set("Authorization", testUser);
    expect(res.status).toBe(200);
    expect(res.body).toBe(7);
  });
  it("Validate user table size is 6", async () => {
    const res = await request.get("/admin/users").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(6);
  });
});

describe("deleteUser", () => {
  it("Deletes user 6 without token", async () => {
    const res = await request.delete("/admin/users/6").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Deletes user 6 with token without admin access", async () => {
    const res = await request
      .delete("/admin/users/6")
      .set("Authorization", user);
    expect(res.status).toBe(403);
  });
  it("Crashes server", async () => {
    await loader.endPool();
    const res = await request
      .delete("/admin/users/6")
      .set("Authorization", admin);
    expect(res.status).toBe(500);
    await loader.startPool();
  });
  it("Deletes user 6 with admin access", async () => {
    const res = await request
      .delete("/admin/users/6")
      .set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body).toBe(6);
  });
  it("Validate user table size is 5", async () => {
    const res = await request.get("/admin/users").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
  });
});

describe("getUserById", () => {
  it("Gets user 6 by ID without token", async () => {
    const res = await request.get("/admin/users/6").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Gets user 6 by ID with token without admin access", async () => {
    const res = await request.get("/admin/users/6").set("Authorization", user);
    expect(res.status).toBe(403);
  });
  it("Crashes server", async () => {
    await loader.endPool();
    const res = await request.get("/admin/users/6").set("Authorization", admin);
    expect(res.status).toBe(500);
    await loader.startPool();
  });
  it("Gets user 6 by ID with admin token", async () => {
    const res = await request.get("/admin/users/6").set("Authorization", admin);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(user6Data.username);
  });
  it("Get user that doesn't exist", async () => {
    const res = await request
      .get("/admin/users/18")
      .set("Authorization", admin);
    expect(res.status).toBe(404);
  });
});
