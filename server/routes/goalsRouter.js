import express from "express";
import * as ctrl from "../controllers/goals.js";

const router = express.Router();

router.get("/goals", ctrl.getGoals);
router.get("/goals/:id", ctrl.getGoalById);
router.get("/goals/user/:id", ctrl.getGoalsWithUserId);
router.post("/goals", ctrl.createGoal);
router.put("/goals/:id", ctrl.updateGoal);
router.delete("/goals/:id", ctrl.deleteGoal);

export default router;
