import rateLimit from "express-rate-limit"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { accessTokenSecret, refreshTokenSecret } from "./lib/utils"
import { UserType } from "./models/User"
import { Document } from "mongoose"
import { AnyZodObject } from "zod"

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message: {
        message:
            "Too many login attempts from this IP, please try again after a 60 second pause",
    },
    handler: (req, res, _next, options) => {
        console.log(
            `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
            "errLog.log"
        )
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = res.statusCode ?? 500
    res.status(status)
    res.json({ message: err.message })
}

export const zParse =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body)
            next()
        } catch (e: any) {
            return res.status(400).send(e.errors)
        }
    }

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (
        !authHeader ||
        (Array.isArray(authHeader) && !authHeader[0]?.startsWith("Bearer "))
    ) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const token = (
        Array.isArray(authHeader) ? authHeader[0] : authHeader
    )?.split(" ")[1]

    jwt.verify(token!, accessTokenSecret, (err: jwt.VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" })
        }

        const decoded = jwt.verify(req.cookies.jwt, refreshTokenSecret)

        const { _id } = decoded as UserType & Document

        req.user = _id.toString()

        next()
    })
}
