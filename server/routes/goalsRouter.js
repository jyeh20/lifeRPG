import express from "express";
import * as ctrl from "../controllers/goals.js";

const router = express.Router();

router.get("/goals", ctrl.getGoals);
router.get("/goals/id/:id", ctrl.getGoalById);
router.get("/goals/name/:name", ctrl.getGoalByName);
router.post("/goals", ctrl.createGoal);
router.put("/goals", ctrl.updateGoal);
router.delete("/goals", ctrl.deleteGoal);

export default router;
