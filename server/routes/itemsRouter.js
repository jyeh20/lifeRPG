import express from "express";
import * as ctrl from "../controllers/items.js";

const router = express.Router();

router.get("/userItems", ctrl.getItems);
router.get("/userItem/:id", ctrl.getItemById);
router.get("/userItem/:name", ctrl.getItemByName);
router.post("/userItem", ctrl.createItem);
router.put("/userItem/:id", ctrl.updateItem);
router.delete("/userItem/:id", ctrl.deleteItem);

export default router;
