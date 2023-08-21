import { Comment, PaginatedData, RawComment } from "@/types"
import { axiosPrivate, axiosRequest } from "./config"

export const getPostComments = async ({
    postId,
    page,
}: {
    postId: string
    page: number
}): Promise<PaginatedData<Comment, "comments">> =>
    axiosRequest(() =>
        axiosPrivate.get(`/posts/${postId}/comments?page=${page}`)
    )

export const createComment = async ({
    postId,
    comment,
}: {
    postId: string
    comment: RawComment
}) =>
    axiosRequest(() => axiosPrivate.post(`/posts/${postId}/comments`, comment))

export const likeComment = async ({
    postId,
    commentId,
}: {
    postId: string
    commentId: string
}) =>
    axiosRequest(() =>
        axiosPrivate.patch(`/posts/${postId}/comments/${commentId}`)
    )

export const deleteComment = async ({
    postId,
    commentId,
}: {
    postId: string
    commentId: string
}) =>
    axiosRequest(() =>
        axiosPrivate.delete(`/posts/${postId}/comments/${commentId}`)
    )
