import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "../env/.env.testing" });

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App running on port ${process.env.SERVER_PORT}.`);
});
