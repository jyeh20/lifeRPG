import express from "express";
import * as ctrl from "../controllers/items.js";

const router = express.Router();

router.get("/items", ctrl.getItems);
router.get("/items/id/:id", ctrl.getItemById);
router.get("/items/name/:name", ctrl.getItemByName);
router.post("/items", ctrl.createItem);
router.put("/items", ctrl.updateItem);
router.delete("/items", ctrl.deleteItem);

export default router;
