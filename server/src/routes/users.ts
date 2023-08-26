import express from "express"
const router = express.Router({ mergeParams: true })
import {
    createUser,
    getUser,
    toggleConnect,
    checkEmail,
    checkUsername,
    getUserPosts,
    viewUserProfile,
    getUserSuggestions,
} from "../controllers/users"
import { isLoggedIn, zParse } from "../middleware"
import { userSchema } from "../lib/validations/user"

router.route("/").post(zParse(userSchema), createUser)

router.post("/check-email", checkEmail)
router.post("/check-username", checkUsername)

router.get("/:id", getUser)

router.get("/:id/posts", getUserPosts)
router.get("/:id/suggestions", isLoggedIn, getUserSuggestions)

router.patch("/:id", viewUserProfile)

router.patch("/:user1Id/:user2Id", isLoggedIn, toggleConnect)

export default router
