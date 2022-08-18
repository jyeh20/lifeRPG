import express from "express";
import * as ctrl from "../controllers/commissions.js";

const router = express.Router();

router.get("/commissions", ctrl.getCommissions);
router.get("/commissions/:id", ctrl.getCommissionById);
router.post("/commissions", ctrl.createCommission);
router.put("/commissions/:id", ctrl.updateCommission);
router.delete("/commissions/:id", ctrl.deleteCommission);

export default router;
