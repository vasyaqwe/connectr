import { PaginatedData, Post, RawPost } from "@/types"
import { axiosPrivate, axiosRequest } from "./config"

export const getPosts = async (
    page: number
): Promise<PaginatedData<Post, "posts">> =>
    axiosRequest(() => axiosPrivate.get(`/posts?page=${page}`))

export const getPost = async (id: string): Promise<Post> =>
    axiosRequest(() => axiosPrivate.get(`/posts/${id}`))

export const createPost = async ({ post }: { post: RawPost }) =>
    axiosRequest(() =>
        axiosPrivate.post(`/posts/`, post, {
            headers: { "Content-Type": "multipart/form-data" },
        })
    )

export const likePost = async (id: string) =>
    axiosRequest(() => axiosPrivate.patch(`/posts/${id}`))

export const deletePost = async (id: string) =>
    axiosRequest(() => axiosPrivate.delete(`/posts/${id}`))
