import { prisma } from "../libs/prisma"
import { CategoryData } from "../types/category.type";

export const categoryService = {
    findAll() {
        return prisma.category.findMany(
            {
                orderBy: {
                    id: "desc",
                }
            }
        )
    },

    create(categoryData: CategoryData) {
        return prisma.category.create({
            data: categoryData,
        });
    }
}