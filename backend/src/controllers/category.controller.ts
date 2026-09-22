import { Request, Response } from "express";
import {categoryService} from "../services/category.service"

export const categoryController = {
    async findAll(req: Request, res: Response){
        const categories = await categoryService.findAll();
        res.json({
            message: "Lấy thông tin danh  ục thành công",
            data: categories,
            success: true,

        })
    }
}