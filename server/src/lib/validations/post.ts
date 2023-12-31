import * as z from "zod"

export const postSchema = z.object({
    image: z.any().optional(),
    body: z
        .string()
        .min(1, { message: "Post must be at least 1 character long" }),
})
