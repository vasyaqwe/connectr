import * as z from "zod"
import { userSchema } from "./user"

export const authSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "Required" })
        .email({ message: "Email must be of valid format" }),
    password: userSchema.shape.password,
})
