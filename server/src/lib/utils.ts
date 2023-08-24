import { CookieOptions } from "express"
import { Secret } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { Document } from "mongoose"
import { UserType } from "../models/User"

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret

export const accessTokenExpiresIn = "15m"
export const refreshTokenExpiresIn = "7d"
export const cookieMaxAge = 7 * 24 * 60 * 60 * 1000

export const rawCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".vercel.app",
}

export const cookieConfig: CookieOptions = {
    ...rawCookieConfig,
    maxAge: cookieMaxAge,
}

export const generateAccessToken = (user: UserType & Document) => {
    const payload = {
        profileImageUrl: user.profileImageUrl,
        email: user.email,
        _id: user._id,
    }

    return jwt.sign(payload, accessTokenSecret, {
        expiresIn: accessTokenExpiresIn,
    })
}

export const generateRefreshToken = (user: UserType & Document) => {
    const payload = {
        profileImageUrl: user.profileImageUrl,
        email: user.email,
        _id: user._id,
    }

    return jwt.sign(payload, refreshTokenSecret, {
        expiresIn: refreshTokenExpiresIn,
    })
}

export const POSTS_LIMIT = 2
