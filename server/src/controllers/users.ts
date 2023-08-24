import User, { UserType } from "../models/User"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { Types } from "mongoose"
import {
    POSTS_LIMIT,
    cookieConfig,
    generateAccessToken,
    generateRefreshToken,
} from "../lib/utils"
import { Post } from "../models/Post"

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

    const user = await User.findOne({ username })

    if (user) {
        res.status(409).json({
            message: "This username is already taken by someone",
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

    const user = await User.findById(id).select("-password")

    if (!user) {
        res.status(400).json({ message: "No user found" })
        return
    }

    res.json(user)
}

export const getUserSuggestions = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid user id" })
        return
    }

    const user = await User.findById(id)
        .select("-password")
        .populate("connections")

    if (!user) {
        res.status(400).json({ message: "No user found" })
        return
    }

    let suggestions: Types.ObjectId[] = []

    for (const connection of user.connections) {
        const connectionUser = await User.findById(connection._id).populate(
            "connections"
        )

        if (connectionUser) {
            for (const suggestedConnection of connectionUser.connections) {
                if (
                    !user.connections.some((existingConnection) =>
                        existingConnection.equals(suggestedConnection._id)
                    ) &&
                    !suggestedConnection.equals(user._id)
                ) {
                    suggestions.push(suggestedConnection)
                }
            }
        }
    }

    res.json(suggestions)
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

export const viewUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid user id" })
        return
    }

    const user = await User.findById(id)

    if (!user) {
        res.status(400).json({
            message: "User not found",
        })
        return
    }

    if (req.user.toString() !== user._id.toString()) {
        user.profileViews += 1
        await user.save()
        res.json({ message: "Profile views incremented" })
    }
}

export const getUserPosts = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid user id" })
        return
    }

    const page = req.query.page || 1

    const posts = await Post.find({ user: id })
        .limit(POSTS_LIMIT * 1)
        .skip((+page - 1) * POSTS_LIMIT)
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        })

    // Getting the numbers of products stored in database
    const count = await Post.countDocuments()

    res.json({
        posts,
        totalPages: Math.ceil(count / POSTS_LIMIT),
        currentPage: page,
    })
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
