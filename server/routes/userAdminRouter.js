import Router from "express-promise-router";
import * as ctrl from "../controllers/adminUsers.js";

const router = new Router();

router.get("/admin/users", ctrl.getUsers);
router.get("/admin/users/:id", ctrl.getUserById);
router.put("/admin/users/:id", ctrl.updateUser);
router.delete("/admin/users/:id", ctrl.deleteUser);

export default router;
