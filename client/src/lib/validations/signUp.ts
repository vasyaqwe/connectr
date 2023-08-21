import * as z from "zod"
import { userSchema } from "./user"

export const signUpSchema = z
    .object({
        email: userSchema.shape.email,
        fullName: userSchema.shape.fullName,
        username: userSchema.shape.username,
        password: userSchema.shape.password,
        location: userSchema.shape.location,
        bio: userSchema.shape.bio,
        confirmPassword: userSchema.shape.password,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "nomessage",
        path: ["password"],
    })
