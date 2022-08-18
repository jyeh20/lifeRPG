import express from "express";
import bodyParser from "body-parser";
import * as routes from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use(routes.users);
app.use(routes.commissions);
app.use(routes.goals);

export default app;
