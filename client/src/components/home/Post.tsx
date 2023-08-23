import { DecodedToken, Post as PostType, PostsInfiniteData } from "@/types"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likePost } from "@/api/posts"
import { useAuth } from "@/hooks/useAuth"
import { forwardRef } from "react"
import { toggleConnect } from "@/api/users"
import { useNavigate } from "react-router-dom"
import { PostHeader, PostBody, PostFooter } from "../Post"
import {
    optimisticallyUpdatedConnections,
    optimisticallyUpdatedLikes,
} from "@/lib/utils"

export const Post = forwardRef<HTMLElement, { post: PostType }>(
    ({ post }, ref) => {
        const user = useAuth() as DecodedToken

        const navigate = useNavigate()
        const queryClient = useQueryClient()

        const queryKey = ["posts"]

        const { error, mutate: onLike } = useMutation(
            () => likePost(post._id),
            {
                onMutate: async () => {
                    // Stop the queries that may affect this operation
                    await queryClient.cancelQueries(queryKey)

                    const prevData =
                        queryClient.getQueryData<PostsInfiniteData>(queryKey)

                    const updatedPages = prevData?.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((paginatedPost) => {
                            if (paginatedPost._id !== post._id) {
                                return paginatedPost
                            }
                            const updatedLikes =
                                optimisticallyUpdatedLikes(paginatedPost)

                            return {
                                ...paginatedPost,
                                likes: updatedLikes,
                            }
                        }),
                    }))

                    queryClient.setQueryData(queryKey, {
                        ...prevData,
                        pages: updatedPages,
                    })

                    return {
                        prevData,
                    }
                },
                onError: (_error, _postId, context) => {
                    if (context?.prevData) {
                        queryClient.setQueryData<PostsInfiniteData>(
                            queryKey,
                            context.prevData
                        )
                    }
                },
                onSuccess: () => {
                    queryClient.invalidateQueries(queryKey)
                },
            }
        )

        const { error: connectError, mutate: onToggleConnect } = useMutation(
            (postUserId: string) =>
                toggleConnect({ userId: user._id, connectionId: postUserId }),
            {
                onMutate: async (postUserId) => {
                    console.log(postUserId)
                    // Stop the queries that may affect this operation
                    await queryClient.cancelQueries(queryKey)

                    const prevData =
                        queryClient.getQueryData<PostsInfiniteData>(queryKey)

                    const updatedPages = prevData?.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((paginatedPost) => {
                            const updatedConnections =
                                optimisticallyUpdatedConnections(paginatedPost)

                            //update user connections on paginated post, just the post that was clicked
                            return {
                                ...paginatedPost,
                                user:
                                    paginatedPost.user._id === postUserId
                                        ? {
                                              ...paginatedPost.user,
                                              connections: updatedConnections,
                                          }
                                        : paginatedPost.user,
                            }
                        }),
                    }))

                    queryClient.setQueryData(queryKey, {
                        ...prevData,
                        pages: updatedPages,
                    })

                    return {
                        prevData,
                    }
                },
                onError: (_error, _postId, context) => {
                    if (context?.prevData) {
                        queryClient.setQueryData<PostsInfiniteData>(
                            queryKey,
                            context.prevData
                        )
                    }
                },
                onSuccess: () => {
                    queryClient.invalidateQueries(queryKey)
                    queryClient.invalidateQueries(["users", user._id])
                },
            }
        )

        useErrorToast(error)
        useErrorToast(connectError)

        return (
            <article
                onClick={(e) => {
                    e.preventDefault()
                    navigate(`/posts/${post._id}`)
                }}
                ref={ref}
                className="cursor-pointer card md:max-w-full"
            >
                <PostHeader
                    onToggleConnect={onToggleConnect}
                    post={post}
                />
                <PostBody post={post} />
                <PostFooter
                    post={post}
                    onLike={onLike}
                />
            </article>
        )
    }
)
