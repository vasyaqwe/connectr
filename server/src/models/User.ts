import { Schema, model } from "mongoose"
import { userSchema } from "../lib/validations/user"
import * as z from "zod"

export type UserType = z.infer<typeof userSchema>

const UserSchema = new Schema<UserType>({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: String,
    connections: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    googleId: String,
    location: String,
    profileImageUrl: String,
    bio: String,
    profileViews: {
        type: Number,
        default: 0,
    },
})

const User = model("User", UserSchema)

export default User
