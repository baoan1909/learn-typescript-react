import zod from "zod";
export const createCategorySchema = zod.object({
    name: zod.string().min(1, "Category is required").prefault(""),
    status: zod.boolean("Trạng thái không hợp lệ").optional(),
})
