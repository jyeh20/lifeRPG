import express from "express";
import * as ctrl from "../controllers/users.js";

const router = express.Router();

router.get("/users", ctrl.getUsers);
router.get("/users/:id", ctrl.getUserById);
router.post("/users", ctrl.createUser);
router.put("/users/:id", ctrl.updateUser);
router.delete("/users/:id", ctrl.deleteUser);

export default router;
