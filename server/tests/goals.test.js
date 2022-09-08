import app from "../app";
import supertest from "supertest";
import * as loader from "./loader.js";
import { generateToken } from "../auth/jwt";

const request = supertest(app);

const user1Data = {
  first_name: "John",
  last_name: "Doe",
  username: "user1",
  password: "password",
  email: "user@1.com",
};
const user2Data = {
  first_name: "Jane",
  last_name: "Doe",
  username: "user2",
  password: "password",
  email: "user@2.com",
};
const invalidData = {
  username: "invalid",
  email: "invalid@email.com",
  first_name: "inva",
  last_name: "lid",
  password: "invalid",
};

const goal1 = {
  name: "Goal1",
  description: "Goal 1 description",
  reward: 1,
};
const goal2 = {
  name: "Goal2",
  reward: 2,
};
const invalidGoalName = {
  description: "Goal description",
  reward: 4,
};
const invalidGoalReward = {
  name: "GoalName",
  reward: -2,
};

let tokens = [];

beforeAll(async () => {
  tokens = await loader.start([user1Data, user2Data]);
  return;
});

afterAll(async () => {
  return await loader.end();
});

describe("createGoal", () => {
  it("No token", async () => {
    const res = await request.post("/goals").send(goal1);
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .post("/goals")
      .send(goal1)
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Empty goal", async () => {
    const res = await request
      .post("/goals")
      .send({})
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Invalid token", async () => {
    const res = await request
      .post("/goals")
      .send(goal1)
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Goals with missing required fields", async () => {
    const res = await request
      .post("/goals")
      .send(goal1)
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Goals with invalid reward", async () => {
    const res = await request
      .post("/goals")
      .send({ ...invalidGoalReward, creator_id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Creates goal 1 for user 1", async () => {
    const res = await request
      .post("/goals")
      .send({ ...goal1, creator_id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...goal1, creator_id: 1 });
  });
  it("Creates duplicate goal for user 1", async () => {
    const res = await request
      .post("/goals")
      .send({ ...goal1, creator_id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(409);
  });
  it("Creates goal 1 for user 2", async () => {
    const res = await request
      .post("/goals")
      .send({ ...goal1, creator_id: 2 })
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, ...goal1, creator_id: 2 });
  });
  it("Creates goal 2 for user 1", async () => {
    const res = await request
      .post("/goals")
      .send({ ...goal2, creator_id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(201);
  });
});

describe("getGoals", () => {
  it("No token", async () => {
    const res = await request.get("/goals");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/goals").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/goals")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Gets all goals for user 1", async () => {
    const res = await request.get("/goals").set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  it("Gets all goals for user 2", async () => {
    const res = await request.get("/goals").set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 2, ...goal1, creator_id: 2 }]);
  });
});

describe("getGoalById", () => {
  it("No token", async () => {
    const res = await request.get("/goals/id/1");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/goals/id/1").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/goals/id/1")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Gets goal 1 for user 1", async () => {
    const res = await request
      .get("/goals/id/1")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, ...goal1, creator_id: 1 });
  });
  it("Gets goal 2 for user 1", async () => {
    const res = await request
      .get("/goals/id/3")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
  });
  it("Gets goal 1 for user 2", async () => {
    const res = await request
      .get("/goals/id/2")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 2, ...goal1, creator_id: 2 });
  });
});

describe("getGoalByName", () => {
  it("No token", async () => {
    const res = await request.get("/goals/name/Goal1");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/goals/name/Goal1").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/goals/name/Goal1")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Gets goal 1 for user 1", async () => {
    const res = await request
      .get("/goals/name/Goal1")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, ...goal1, creator_id: 1 });
  });
  it("Gets goal 2 for user 1", async () => {
    const res = await request
      .get("/goals/name/Goal2")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
  });
  it("Gets goal 1 for user 2", async () => {
    const res = await request
      .get("/goals/name/Goal1")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 2, ...goal1, creator_id: 2 });
  });
});

describe("updateGoal", () => {
  it("No token", async () => {
    const res = await request.put("/goals").send({ ...goal1, creator_id: 1 });
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .put("/goals")
      .send({ ...goal1, creator_id: 1 })
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .put("/goals")
      .send({ ...goal1, creator_id: 1 })
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Empty goal", async () => {
    const res = await request
      .put("/goals")
      .send({})
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Goal doesn't exist", async () => {
    const res = await request
      .put("/goals")
      .send({ ...goal1, creator_id: 1, id: 10 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(404);
  });
  it("Goal with missing fields", async () => {
    const res = await request
      .put("/goals")
      .send({ ...invalidGoalName, id: 1, creator_id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Goal with negative reward", async () => {
    const res = await request
      .put("/goals")
      .send({ ...invalidGoalReward, id: 1, creator_id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Updates goal1 for user 1 as duplicate", async () => {
    const res = await request
      .put("/goals")
      .send({ ...goal2, creator_id: 1, id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(409);
  });
  it("Updates goal1 for user 1", async () => {
    const res = await request
      .put("/goals")
      .send({ ...goal1, creator_id: 1, id: 1, name: "updatedGoal1" })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      ...goal1,
      name: "updatedGoal1",
      creator_id: 1,
    });
  });
  it("Updates goal1 for user 2", async () => {
    const res = await request
      .put("/goals")
      .send({ ...goal2, creator_id: 2, id: 2 })
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
  });
});

describe("deleteGoal", () => {
  it("No token", async () => {
    const res = await request.delete("/goals").send({ id: 1 });
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .delete("/goals")
      .send({ id: 1 })
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .delete("/goals")
      .send({ id: 1 })
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Empty goal", async () => {
    const res = await request
      .delete("/goals")
      .send({})
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(404);
  });
  it("Goal doesn't exist", async () => {
    const res = await request
      .delete("/goals")
      .send({ id: 10 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(404);
  });
  it("Deletes goal1 for user 1", async () => {
    const res = await request
      .delete("/goals")
      .send({ id: 1 })
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      ...goal1,
      name: "updatedGoal1",
      creator_id: 1,
    });
  });
  it("Deletes goal1 for user 2", async () => {
    const res = await request
      .delete("/goals")
      .send({ id: 2 })
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
  });
});
