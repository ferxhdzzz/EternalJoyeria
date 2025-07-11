import { Router } from "express";
import salesController from "../controllers/salesController.js";

const router = Router();


router.get("/", salesController.getSales);
router.get("/:id", salesController.getSale);
router.post("/", salesController.createSale);
router.put("/:id", salesController.updateSale);
router.delete("/:id", salesController.deleteSale);

export default router;

