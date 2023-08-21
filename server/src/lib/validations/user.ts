import { Types } from "mongoose"
import * as z from "zod"

export const userSchema = z.object({
    fullName: z.string(),
    email: z.string().email({ message: "Email must be of valid format" }),
    username: z
        .string()
        .min(3, {
            message: "Username must be at least 4 characters",
        })
        .max(14, {
            message: "Username must be no more than 14 characters",
        }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
    connections: z.array(z.instanceof(Types.ObjectId)).optional(),
    googleId: z.string().optional(),
    location: z.string().optional(),
    profileImageUrl: z.string().optional(),
    bio: z.string().optional(),
    profileViews: z.number().optional(),
})
