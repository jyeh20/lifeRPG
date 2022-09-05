import express from "express";
import * as ctrl from "../controllers/commissions.js";

const router = express.Router();

router.get("/commissions", ctrl.getCommissions);
router.get("/commissions/id/:id", ctrl.getCommissionById);
router.get("/commissions/name/:name", ctrl.getCommissionByName);
router.post("/commissions", ctrl.createCommission);
router.put("/commissions", ctrl.updateCommission);
router.delete("/commissions", ctrl.deleteCommission);

export default router;
