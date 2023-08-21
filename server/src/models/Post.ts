import { Schema, model } from "mongoose"
import { Comment } from "./Comment"

const PostSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        image: {
            path: String,
            filename: String,
        },
        body: String,
        comments: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Comment",
                },
            ],
            default: [],
        },
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

PostSchema.post("findOneAndDelete", async (post) => {
    if (post) {
        await Comment.deleteMany({ _id: { $in: post.comments } })
    }
})

export const Post = model("Post", PostSchema)
