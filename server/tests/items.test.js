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

const item1 = {
  name: "item1",
  cost: 12,
};
const item2 = {
  name: "item2",
  cost: 20000,
  item_url: "https://www.item2.com",
};
const item3 = {
  name: "item3",
  cost: 100,
};
const item4 = {
  name: "item4",
  cost: 100,
};
const item5 = {
  name: "item5",
  cost: 100,
};
const item6 = {
  name: "item6",
  cost: 100,
};
const newItem1 = {
  ...item1,
  creator_id: 1,
  id: 1,
  item_url: "item1.com",
};
const duplicateItem1 = {
  ...item3,
  name: "item1",
  id: 3,
  creator_id: 1,
};
const newItem2 = {
  ...item2,
  cost: 20000,
  id: 2,
  creator_id: 2,
};

let tokens = [];

beforeAll(async () => {
  tokens = await loader.start([user1Data, user2Data]);
  return;
});

afterAll(async () => {
  return await loader.end();
});

describe("createItem", () => {
  it("No token", async () => {
    const res = await request
      .post("/userItem")
      .send({ ...item1, creator_id: 0 });
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .post("/userItem")
      .send({ ...item1, creator_id: 0 })
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Empty item", async () => {
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[0])
      .send({});
    expect(res.status).toBe(403);
  });
  it("Invalid token", async () => {
    const res = await request
      .post("/userItem")
      .set("Authorization", generateToken(invalidData))
      .send({ ...item1, creator_id: 0 });
    expect(res.status).toBe(401);
  });
  it("Item with missing required fields", async () => {
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[0])
      .send({ cost: 100 });
    expect(res.status).toBe(403);
  });
  it("Creates item 1 for user 1", async () => {
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[0])
      .send({ ...item1, creator_id: 1 });
    expect(res.status).toBe(201);
  });
  it("Creates duplicate item for user 1", async () => {
    const user = 1;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item1, creator_id: user });
    expect(res.status).toBe(409);
  });
  it("Adds item 2 to user 2", async () => {
    const user = 2;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item2, creator_id: user });
    expect(res.status).toBe(201);
  });
  it("Adds item 3 to user 1", async () => {
    const user = 1;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item3, creator_id: user });
    expect(res.status).toBe(201);
  });
  it("Adds item 4 to user 2", async () => {
    const user = 2;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item4, creator_id: user });
    expect(res.status).toBe(201);
  });
  it("Adds item 4 to user 1", async () => {
    const user = 1;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item4, creator_id: user });
    expect(res.status).toBe(201);
  });
  it("Adds item 5 to user 2", async () => {
    const user = 2;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item5, creator_id: user });
    expect(res.status).toBe(201);
  });
  it("Adds item 6 to user 1", async () => {
    const user = 1;
    const res = await request
      .post("/userItem")
      .set("Authorization", tokens[user - 1])
      .send({ ...item6, creator_id: user });
    expect(res.status).toBe(201);
  });
});

describe("getItems", () => {
  it("No token", async () => {
    const res = await request.get("/userItems");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/userItems").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/userItems")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Returns items for user 1", async () => {
    const res = await request.get("/userItems").set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });
  it("Returns items for user 2", async () => {
    const res = await request.get("/userItems").set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
});

describe("getItemById", () => {
  it("No token", async () => {
    const res = await request.get("/userItem/id/1");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request.get("/userItem/id/1").set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/userItem/id/1")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Returns item 1 for user 1", async () => {
    const res = await request
      .get("/userItem/id/1")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe("item1");
  });
  it("Returns item 2 for user 2", async () => {
    const res = await request
      .get("/userItem/id/2")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.name).toBe("item2");
  });
  it("Returns item 4 for user 2", async () => {
    const res = await request
      .get("/userItem/id/4")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(4);
    expect(res.body.name).toBe("item4");
  });
  it("Returns item 4 for user 1", async () => {
    const res = await request
      .get("/userItem/id/5")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(5);
    expect(res.body.name).toBe("item4");
  });
});

describe("getItemByName", () => {
  it("No token", async () => {
    const res = await request.get("/userItem/name/item1");
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .get("/userItem/name/item1")
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .get("/userItem/name/item1")
      .set("Authorization", generateToken(invalidData));
    expect(res.status).toBe(401);
  });
  it("Returns item 1 for user 1", async () => {
    const res = await request
      .get("/userItem/name/item1")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe("item1");
  });
  it("Returns item 2 for user 2", async () => {
    const res = await request
      .get("/userItem/name/item2")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.name).toBe("item2");
  });
  it("Returns item 4 for user 2", async () => {
    const res = await request
      .get("/userItem/name/item4")
      .set("Authorization", tokens[1]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(4);
    expect(res.body.name).toBe("item4");
  });
  it("Returns item 4 for user 1", async () => {
    const res = await request
      .get("/userItem/name/item4")
      .set("Authorization", tokens[0]);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(5);
    expect(res.body.name).toBe("item4");
  });
});

describe("updateItem", () => {
  it("No token", async () => {
    const res = await request
      .put("/userItem")
      .send({ ...item1, creator_id: 0, id: 1 });
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .put("/userItem")
      .send({ ...item1, creator_id: 0, id: 1 })
      .set("Authorization", "");
    expect(res.status).toBe(401);
  });
  it("Empty item", async () => {
    const res = await request
      .put("/userItem")
      .set("Authorization", tokens[0])
      .send({});
    expect(res.status).toBe(403);
  });
  it("Invalid token", async () => {
    const res = await request
      .put("/userItem")
      .set("Authorization", generateToken(invalidData))
      .send(newItem1);
    expect(res.status).toBe(401);
  });
  it("Item doesn't exist", async () => {
    const res = await request
      .put("/userItem")
      .set("Authorization", tokens[0])
      .send({ ...item1, creator_id: 1, id: 10 });
    expect(res.status).toBe(404);
  });
  it("Item with missing required fields", async () => {
    const res = await request
      .put("/userItem")
      .set("Authorization", tokens[0])
      .send({ cost: 100 });
    expect(res.status).toBe(403);
  });
  it("Updates item 1 for user 1 with new item_url", async () => {
    const res = await request
      .put("/userItem")
      .set("Authorization", tokens[0])
      .send(newItem1);
    expect(res.status).toBe(200);
  });
  it("Creates duplicate item for user 1", async () => {
    const user = 1;
    const res = await request
      .put("/userItem")
      .set("Authorization", tokens[user - 1])
      .send(duplicateItem1);
    expect(res.status).toBe(409);
  });
  it("Updates item 2 for user 2 with new cost", async () => {
    const user = 2;
    const res = await request
      .put("/userItem")
      .set("Authorization", tokens[user - 1])
      .send(newItem2);
    expect(res.status).toBe(200);
  });
});

describe("deleteItem", () => {
  it("No token", async () => {
    const res = await request.delete("/userItem").send(newItem1);
    expect(res.status).toBe(401);
  });
  it("Empty string as token", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", "")
      .send(newItem1);
    expect(res.status).toBe(401);
  });
  it("Invalid token", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", generateToken(invalidData))
      .send(newItem1);
    expect(res.status).toBe(401);
  });
  it("Item doesn't exist", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", tokens[0])
      .send({ ...duplicateItem1, id: 10 });
    expect(res.status).toBe(404);
  });
  it("Deletes empty item for user 1", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", tokens[0])
      .send({});
    expect(res.status).toBe(400);
  });
  it("Deletes item 1 for user 1", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", tokens[0])
      .send(newItem1);
    expect(res.status).toBe(200);
  });
  it("Deletes item 2 for user 2", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", tokens[1])
      .send(newItem2);
    expect(res.status).toBe(200);
  });
  it("Deletes item 4 for user 2", async () => {
    console.log("Deleting item 4 from user 2");
    const res = await request
      .delete("/userItem")
      .set("Authorization", tokens[1])
      .send({ ...item4, creator_id: 2, id: 4 });
    expect(res.status).toBe(200);
  });
  it("Deletes item 4 for user 1", async () => {
    const res = await request
      .delete("/userItem")
      .set("Authorization", tokens[0])
      .send({ ...item4, creator_id: 1, id: 5 });
    expect(res.status).toBe(200);
  });
});
