import express from "express"
import "express-async-errors"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import cookieParser from "cookie-parser"
import helmet from "helmet"
import authRoutes from "./routes/auth"
import usersRoutes from "./routes/users"
import postsRoutes from "./routes/posts"
import commentsRoutes from "./routes/comments"
import connectDB from "./db"
import { errorHandler } from "./middleware"

const app = express()

connectDB()

const corsOptions = {
    origin: ["http://localhost:5173", "https://connectr.vercel.app"],
    credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))

app.use(errorHandler)

app.use("/auth", authRoutes)
app.use("/users", usersRoutes)
app.use("/posts", postsRoutes)
app.use("/posts/:id/comments", commentsRoutes)

app.all("*", (_req, res, _next) => {
    res.status(404).json({ message: "Page not found" })
})

app.listen(3000, () => console.log(`LISTENING ON PORT 3000!`))

export default app
