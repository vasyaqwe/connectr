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

router.use(isLoggedIn)

router
    .route("/")
    .get(getPostComments)
    .post(zParse(commentSchema), createComment)

router.route("/:commentId").patch(likeComment).delete(deleteComment)

export default router
