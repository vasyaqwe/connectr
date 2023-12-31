import { Post } from "../models/Post"
import { Request, Response } from "express"
import { Types } from "mongoose"
import { cloudinary } from "../cloudinary"
import { POSTS_LIMIT } from "../lib/utils"

export const getPosts = async (req: Request, res: Response) => {
    const page = req.query.page || 1

    const posts = await Post.find()
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
export const getPost = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid post id" })
        return
    }

    const post = await Post.findById(id).populate({
        path: "user",
        select: "-password",
    })

    if (!post) {
        res.status(400).json({ message: "No post found!" })
        return
    }

    res.json(post)
}

export const createPost = async (req: Request, res: Response) => {
    let image

    if (req.file) {
        image = { path: req.file.path, filename: req.file.filename }
    }

    const post = await Post.create({ ...req.body, image, user: req.user })

    if (post) {
        res.status(201).json({ message: `New post ${post.id} created` })
    } else {
        res.status(400).json({ message: `Invalid post data received!` })
    }
}

export const likePost = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid post id" })
        return
    }

    const post = await Post.findById(id)

    if (!post) {
        res.status(400).json({ message: "Post not found" })
        return
    }

    const userId = new Types.ObjectId(req.user)

    const isLiked = post.likes.includes(userId)

    if (isLiked) {
        post.likes = post.likes.filter(
            (likeUserId) => likeUserId.toString() !== userId.toString()
        )
    } else {
        post.likes.push(userId)
    }

    await post.save()

    res.json(post)
}

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid post id" })
        return
    }

    const post = await Post.findById(id)

    if (!post) {
        res.status(400).json({ message: "No post found!" })
        return
    }

    const deletedPost = await Post.findByIdAndDelete(id)

    if (deletedPost && deletedPost.image && "image" in deletedPost.toObject()) {
        await cloudinary.uploader.destroy(deletedPost.image.filename)
    }

    res.json({ message: `Post ${post!._id} was deleted!` })
}
