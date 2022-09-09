import * as DAL from "../DAL";

let tokens = [];

beforeAll(async () => {
  const res = await DAL.usernameLogin("fredreleinalice", "pass");
  console.log(res.data);
});

function sum(a, b) {
  return a + b;
}

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
