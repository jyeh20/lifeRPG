import express from "express";
import bodyParser from "body-parser";
import * as routes from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes.users);
app.use(routes.commissions);
app.use(routes.goals);
app.use(routes.adminUsers);
app.use(routes.items);

export default app;
