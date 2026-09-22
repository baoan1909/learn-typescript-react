import express from "express";
import { categoryController } from "../controllers/category.controller";
const router = express.Router();
router.get("/categories", categoryController.findAll );
export default router;
