import { Schema, model } from "mongoose"

const CommentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        body: String,
        likes: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
)

export const Comment = model("Comment", CommentSchema)
