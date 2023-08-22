import { Comment } from "../models/Comment"
import { Request, Response } from "express"
import { Types } from "mongoose"
import { Post } from "../models/Post"

const LIMIT = 2

export const getPostComments = async (req: Request, res: Response) => {
    const page = req.query.page || 1
    const postId = req.params.id

    if (!postId || !Types.ObjectId.isValid(postId)) {
        res.status(400).json({ message: "Invalid post id" })
        return
    }

    const post = await Post.findById(postId).populate({
        path: "comments",
        populate: {
            path: "user",
            select: "-password",
        },
        options: { sort: { createdAt: -1 } },
    })

    if (!post) {
        return res.status(404).json({ error: "Post not found" })
    }

    const totalComments = post.comments.length
    const skipAmount = (+page - 1) * LIMIT
    const comments = post.comments.slice(skipAmount, skipAmount + LIMIT)

    return res.json({
        comments,
        totalPages: Math.ceil(totalComments / LIMIT),
        currentPage: page,
    })
}

export const createComment = async (req: Request, res: Response) => {
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

    const comment = await Comment.create({ ...req.body, user: req.user })
    post.comments = [...post.comments, comment._id]

    if (comment) {
        post.save()
        res.status(201).json({ message: `New comment ${comment.id} created` })
    } else {
        res.status(400).json({ message: `Invalid comment payload` })
    }
}

export const likeComment = async (req: Request, res: Response) => {
    const { commentId } = req.params

    if (!commentId || !Types.ObjectId.isValid(commentId)) {
        res.status(400).json({ message: "Invalid comment id" })
        return
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        res.status(400).json({ message: "Comment not found" })
        return
    }

    const userId = new Types.ObjectId(req.user)

    const isLiked = comment.likes.includes(userId)

    if (isLiked) {
        comment.likes = comment.likes.filter(
            (likeUserId) => likeUserId.toString() !== userId.toString()
        )
    } else {
        comment.likes.push(userId)
    }

    await comment.save()

    res.json(comment)
}

export const deleteComment = async (req: Request, res: Response) => {
    const { id, commentId } = req.params

    if (!id || !Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid post id" })
        return
    }

    if (!commentId || !Types.ObjectId.isValid(commentId)) {
        res.status(400).json({ message: "Invalid comment id" })
        return
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        res.status(400).json({ message: "No comment found!" })
        return
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (deletedComment) {
        await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } })
    }

    res.json({ message: `Comment ${comment!._id} was deleted!` })
}
