import Router from "express-promise-router";
import * as ctrl from "../controllers/users.js";

const router = new Router();

router.get("/users", ctrl.getUsers);
router.get("/users/username", ctrl.getSelfByUsername);
router.get("/users/id", ctrl.getSelfById);
router.post("/users", ctrl.createUser);
router.post("/users/login/email", ctrl.getUserWithEmailLogin);
router.post("/users/login/username", ctrl.getUserWithUsernameLogin);
router.put("/users", ctrl.updateSelf);
router.delete("/users", ctrl.deleteSelf);

export default router;
