import Router from "express-promise-router";
import * as ctrl from "../controllers/users.js";

const router = new Router();

router.get("/users", ctrl.getUsers);
router.get("/users/username", ctrl.getUserByUsername);
router.get("/users", ctrl.getUserById);
router.post("/users", ctrl.createUser);
router.post("/users/login", ctrl.getUserWithLogin);
router.put("/users", ctrl.updateUser);
router.delete("/users/:id", ctrl.deleteUser);

export default router;
