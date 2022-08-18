import dotenv from "dotenv";
import app from "./app.js";

const nodeEnv = process.env.NODE_ENV || "development";

switch (nodeEnv) {
  case "production":
    dotenv.config({ path: "../config/config.prod.env" });
    break;
  case "test":
    dotenv.config({ path: "../config/config.test.env" });
    break;
  default:
    dotenv.config({ path: "../config/config.dev.env" });
}
console.log(process.env.SERVER_PORT);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${process.env.SERVER_PORT}.`);
});
