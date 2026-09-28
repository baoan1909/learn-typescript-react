import express from "express";
import { categoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema } from "../validators/category.validator";

const router = express.Router();
router.get("/categories", categoryController.findAll );
router.post(
    "/categories",
    validate(createCategorySchema),
    categoryController.create
)
export default router;
