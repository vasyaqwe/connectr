import express from "express"
const router = express.Router({ mergeParams: true })
import {
    createComment,
    likeComment,
    deleteComment,
    getPostComments,
} from "../controllers/comments"
import { isLoggedIn, zParse } from "../middleware"
import { commentSchema } from "../lib/validations/comment"

router
    .route("/")
    .get(getPostComments)
    .post(isLoggedIn, zParse(commentSchema), createComment)

router
    .route("/:commentId")
    .patch(isLoggedIn, likeComment)
    .delete(isLoggedIn, deleteComment)

export default router
