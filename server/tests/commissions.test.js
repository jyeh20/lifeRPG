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

const com1 = {
  name: "commission1",
  description: "description1",
  freq_type: "daily",
  freq: 1,
  difficulty: 1,
  num_times_completed: 0,
  completed: 0,
};
const com2 = {
  name: "commission2",
  freq_type: "weekly",
  freq: 5,
  difficulty: 2,
  num_times_completed: 0,
  completed: 0,
};
const invalidCommission = {
  freq_type: "yearly",
  freq: 2,
  difficulty: 3,
  num_times_completed: 0,
  completed: 0,
};
const updatedCom1 = {
  ...com1,
  num_times_completed: 1,
  completed: 1,
};
const invalidUpdate = {
  ...com2,
  freq: -1,
};

let tokens = [];

beforeAll(async () => {
  tokens = await loader.start([user1Data, user2Data]);
  return;
});

afterAll(async () => {
  return await loader.end();
});

describe("createCommission", () => {
  it("No token", async () => {
    const res = await request.post("/commissions").send(com1);
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .post("/commissions")
      .send(com1)
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Empty commission", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[0])
      .send({});
    expect(res.status).toBe(403);
  });
  it("Invalid token", async () => {
    const res = await request
      .post("/commissions")
      .send(com1)
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Commission with missing required fields", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...invalidCommission });
    expect(res.status).toBe(403);
  });
  it("Creates commission 1 for user 1", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...com1, creator_id: 1 });
    expect(res.status).toBe(201);
  });
  it("Creates duplicate commission for user 1", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...com1, creator_id: 1 });
    expect(res.status).toBe(409);
  });
  it("Adds commission 1 to user 2", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[1])
      .send({ ...com1, creator_id: 2 });
    expect(res.status).toBe(201);
  });
  it("Adds commission 2 to user 1", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...com2, creator_id: 1 });
    expect(res.status).toBe(201);
  });
  it("Adds commission 2 to user 2", async () => {
    const res = await request
      .post("/commissions")
      .set("Authorization", tokens[1])
      .send({ ...com2, creator_id: 2 });
    expect(res.status).toBe(201);
  });
});

describe("getCommissions", () => {
  it("No token", async () => {
    const res = await request.get("/commissions");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/commissions").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/commissions")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Returns items for user 1", async () => {
    const res = await request
      .get("/commissions")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  it("Returns items for user 2", async () => {
    const res = await request
      .get("/commissions")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

describe("getCommissionById", () => {
  it("No token", async () => {
    const res = await request.get("/commissions/id/1");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/commissions/id/1").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/commissions/id/1")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Returns item 1 for user 1", async () => {
    const res = await request
      .get("/commissions/id/1")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe(com1.name);
  });
  it("Returns item 1 for user 2", async () => {
    const res = await request
      .get("/commissions/id/2")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.name).toBe(com1.name);
  });
  it("Returns item 2 for user 1", async () => {
    const res = await request
      .get("/commissions/id/3")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(3);
    expect(res.body.name).toBe(com2.name);
  });
});

describe("getCommissionByName", () => {
  it("No token", async () => {
    const res = await request.get("/commissions/name/commission1");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .get("/commissions/name/commission1")
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/commissions/name/commission1")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Returns item 1 for user 1", async () => {
    const res = await request
      .get("/commissions/name/commission1")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe(com1.name);
  });
  it("Returns item 1 for user 2", async () => {
    const res = await request
      .get("/commissions/name/commission1")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.name).toBe(com1.name);
  });
  it("Returns item 2 for user 1", async () => {
    const res = await request
      .get("/commissions/name/commission2")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(3);
    expect(res.body.name).toBe(com2.name);
  });
});

describe("updateCommission", () => {
  it("No token", async () => {
    const res = await request.put("/commissions").send(updatedCom1);
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .put("/commissions")
      .send(updatedCom1)
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Empty commission", async () => {
    const res = await request
      .put("/commissions")
      .send({})
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(403);
  });
  it("Invalid token", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", generateToken(invalidData))
      .send(updatedCom1);
    expect(res.status).toBe(401);
  });
  it("Commission doesn't exist", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...com1, creator_id: 1, id: 10 });
    expect(res.status).toBe(404);
  });
  it("Commission with missing required fields", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", tokens[0])
      .send({ name: "com2" });
    expect(res.status).toBe(403);
  });
  it("Updates com1 for user 1", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...updatedCom1, creator_id: 1, id: 1 });
    expect(res.status).toBe(200);
  });
  it("Updates com1 for user 1 with negative values", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...invalidUpdate, creator_id: 1, id: 1 });
    expect(res.status).toBe(403);
  });
  it("Updates com2 for user 1 as duplicate", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...updatedCom1, creator_id: 1, id: 3 });
    expect(res.status).toBe(409);
  });
  it("Updates com1 for user 2", async () => {
    const res = await request
      .put("/commissions")
      .set("Authorization", tokens[1])
      .send({ ...updatedCom1, creator_id: 2, id: 2 });
    expect(res.status).toBe(200);
  });
});

describe("deleteCommission", () => {
  it("No token", async () => {
    const res = await request.delete("/commissions").send(com1);
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .delete("/commissions")
      .set("Authorization", "")
      .send(com1);
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .delete("/commissions")
      .set("Authorization", generateToken(invalidData))
      .send(com1);
    expect(res.status).toBe(401);
  });
  it("Commission doesn't exist", async () => {
    const res = await request
      .delete("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...com1, creator_id: 1, id: 10 });
    expect(res.status).toBe(404);
  });
  it("Deletes empty commission for user 1", async () => {
    const res = await request
      .delete("/commissions")
      .set("Authorization", tokens[0])
      .send({});
    expect(res.status).toBe(400);
  });
  it("Deletes com1 for user 1", async () => {
    const res = await request
      .delete("/commissions")
      .set("Authorization", tokens[0])
      .send({ ...updatedCom1, creator_id: 1, id: 1 });
    expect(res.status).toBe(200);
  });
  it("Deletes com2 for user 2", async () => {
    const res = await request
      .delete("/commissions")
      .set("Authorization", tokens[1])
      .send({ ...com2, creator_id: 2, id: 4 });
    expect(res.status).toBe(200);
  });
});
