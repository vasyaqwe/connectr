import * as z from "zod"

export const commentSchema = z.object({
    body: z
        .string()
        .min(1, { message: "Comment must be at least 1 character long" }),
})
