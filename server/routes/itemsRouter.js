import express from "express";
import * as ctrl from "../controllers/items.js";

const router = express.Router();

router.get("/userItems", ctrl.getItems);
router.get("/userItem/id/:id", ctrl.getItemById);
router.get("/userItem/name/:name", ctrl.getItemByName);
router.post("/userItem", ctrl.createItem);
router.put("/userItem", ctrl.updateItem);
router.delete("/userItem", ctrl.deleteItem);

export default router;
