import { prisma } from "../libs/prisma"

export const categoryService = {
    findAll(){
        return prisma.category.findMany(
            {
                orderBy:{
                    id:"desc",
                }
            }
        )
    }
}