import { PaginatedData, Post, RawUser, User } from "@/types"
import { axiosPrivate, axiosRequest } from "./config"

export const checkEmail = async ({ email }: { email: string }) =>
    axiosRequest(() => axiosPrivate.post(`/users/check-email`, { email }))

export const checkUsername = async ({ username }: { username: string }) =>
    axiosRequest(() =>
        axiosPrivate.post(`/users/check-username`, {
            username,
        })
    )

export const toggleConnect = async (id: string, connectionId: string) =>
    axiosRequest(() => axiosPrivate.patch(`/users/${id}/${connectionId}`))

export const viewUserProfile = async (id: string) =>
    axiosRequest(() => axiosPrivate.patch(`/users/${id}`))

export const getUser = async (id: string): Promise<User> =>
    axiosRequest(() => axiosPrivate.get(`/users/${id}`))

export const getUserSuggestions = async (id: string): Promise<User[]> =>
    axiosRequest(() => axiosPrivate.get(`/users/${id}/suggestions`))

export const getUserPosts = async ({
    page,
    id,
}: {
    page: number
    id: string
}): Promise<PaginatedData<Post, "posts">> =>
    axiosRequest(() => axiosPrivate.get(`/users/${id}/posts?page=${page}`))

export const createUser = async (
    user: RawUser
): Promise<{ accessToken: string }> =>
    axiosRequest(() => axiosPrivate.post(`/users`, user))
