import express from "express"
const router = express.Router({ mergeParams: true })
import {
    getPosts,
    getPost,
    createPost,
    likePost,
    deletePost,
} from "../controllers/posts"
import { isLoggedIn, zParse } from "../middleware"
import { upload } from "../cloudinary"
import { postSchema } from "../lib/validations/post"

router
    .route("/")
    .get(getPosts)
    .post(isLoggedIn, upload.single("image"), zParse(postSchema), createPost)

router
    .route("/:id")
    .get(getPost)
    .patch(isLoggedIn, likePost)
    .delete(isLoggedIn, deletePost)

export default router
