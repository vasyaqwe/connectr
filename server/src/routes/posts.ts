import express from "express"
const router = express.Router({ mergeParams: true })
import {
    getPosts,
    getPost,
    createPost,
    likePost,
    deletePost,
    getUserPosts,
} from "../controllers/posts"
import { isLoggedIn, zParse } from "../middleware"
import { upload } from "../cloudinary"
import { postSchema } from "../lib/validations/post"

router.use(isLoggedIn)

router
    .route("/")
    .get(getPosts)
    .post(upload.single("image"), zParse(postSchema), createPost)

router.route("/:id").get(getPost).patch(likePost).delete(deletePost)

router.get("/:userId/posts", zParse(postSchema), getUserPosts)

export default router
