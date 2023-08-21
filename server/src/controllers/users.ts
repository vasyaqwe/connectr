import User from "../models/User"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { Types } from "mongoose"
import {
    cookieConfig,
    generateAccessToken,
    generateRefreshToken,
} from "../lib/utils"

export const checkEmail = async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (user) {
        res.status(409).json({ message: "Email is already registered" })
        return
    }

    res.status(200).json({ user })
}

export const checkUsername = async (req: Request, res: Response) => {
    const { username } = req.body

    const user = await User.findOne({ username, googleId: { $exists: false } })

    if (user) {
        res.status(409).json({
            message: "This username is already taken by someone.",
        })
        return
    }

    res.status(200).json({ user })
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid user id" })
        return
    }

    const user = await User.findById(id)

    if (!user) {
        res.status(400).json({ message: "No user found" })
        return
    }

    res.json(user)
}

export const getUsers = async (_req: Request, res: Response) => {
    const users = await User.find({})

    if (!users?.length) {
        res.status(400).json({ message: "No users found!" })
        return
    }

    res.json(users)
}

export const getUserConnections = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await User.findById(id)

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid user id" })
        return
    }

    if (!user) {
        res.status(400).json({ message: "No user found!" })
        return
    }
    const connections = user.populate("connections")

    res.json(connections)
}

export const toggleConnect = async (req: Request, res: Response) => {
    const { user1Id, user2Id } = req.params

    if (
        !user1Id ||
        !Types.ObjectId.isValid(user1Id) ||
        !user2Id ||
        !Types.ObjectId.isValid(user2Id)
    ) {
        res.status(400).json({ message: "Invalid user id" })
        return
    }

    const user1 = await User.findById(user1Id)

    const user2 = await User.findById(user2Id)

    if (!user1) {
        res.status(400).json({
            message: "There was an error processing your information.",
        })
        return
    }

    if (!user2) {
        res.status(400).json({
            message: "There was an error processing your information.",
        })
        return
    }

    const user1ObjectId = new Types.ObjectId(user1Id)
    const user2ObjectId = new Types.ObjectId(user2Id)

    if (user1.connections && user2.connections) {
        if (user1.connections.some((c) => c.toString() === user2Id)) {
            user1.connections = user1.connections.filter(
                (id) => id.toString() !== user2Id
            )
            user2.connections = user2.connections.filter(
                (id) => id.toString() !== user1Id
            )
        } else {
            user1.connections.push(user2ObjectId)
            user2.connections.push(user1ObjectId)
        }
    }

    await user1.save()
    await user2.save()

    res.json(user1.populate("connections"))
}

export const createUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    const duplicate = await User.findOne({
        email,
        googleId: { $exists: false },
    })
        .lean()
        .exec()

    if (duplicate) {
        res.status(409).json({ message: "User already exists!" })
        return
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userData = {
        ...req.body,
        profileImageUrl: `https://api.dicebear.com/6.x/micah/svg?seed=${username}`,
        password: hashedPwd,
    }

    const user = await User.create(userData)

    if (user) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.cookie("jwt", refreshToken, cookieConfig)

        res.status(201).json({ accessToken })
    } else {
        res.status(400).json({ message: `Invalid user data received!` })
    }

    return
}
