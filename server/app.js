import express from "express";
import bodyParser from "body-parser";
import usersRouter from "./routes/usersRouter.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.use(usersRouter);

export default app;
