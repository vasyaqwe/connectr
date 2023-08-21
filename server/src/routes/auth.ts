import express from "express"
const router = express.Router({ mergeParams: true })
import { loginLimiter, zParse } from "../middleware"
import { login, refresh, logout, googleLogin } from "../controllers/auth"
import { authSchema } from "../lib/validations/auth"

router.route("/").post(loginLimiter, zParse(authSchema), login)
router.route("/google-login").post(googleLogin)

router.route("/refresh").get(refresh)

router.route("/logout").post(logout)

export default router
