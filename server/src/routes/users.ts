import express from "express"
const router = express.Router({ mergeParams: true })
import {
    createUser,
    getUser,
    getUserConnections,
    toggleConnect,
    checkEmail,
    checkUsername,
} from "../controllers/users"
import { isLoggedIn, zParse } from "../middleware"
import { userSchema } from "../lib/validations/user"

router.route("/").post(zParse(userSchema), createUser)

router.post("/check-email", checkEmail)
router.post("/check-username", checkUsername)

router.get("/:id", isLoggedIn, getUser)
router.get("/:id/connections", isLoggedIn, getUserConnections)

router.patch("/:user1Id/:user2Id", isLoggedIn, toggleConnect)

export default router
