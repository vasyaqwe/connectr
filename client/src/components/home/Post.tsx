import { DecodedToken, PaginatedData, Post as PostType } from "@/types"
import { useErrorToast } from "@/hooks/useErrorToast"
import {
    InfiniteData,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query"
import { likePost } from "@/api/posts"
import { useAuth } from "@/hooks/useAuth"
import { forwardRef } from "react"
import { toggleConnect } from "@/api/users"
import { useNavigate } from "react-router-dom"
import { PostHeader, PostBody, PostFooter } from "../Post"

type PostsInfiniteData = InfiniteData<PaginatedData<PostType, "posts">>

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

                            const liked = paginatedPost.likes.includes(user._id)

                            const updatedLikes = liked
                                ? paginatedPost.likes.filter(
                                      (userLike) => userLike !== user._id
                                  )
                                : [...paginatedPost.likes, user._id]

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
            () => toggleConnect(user._id, post.user._id),
            {
                onMutate: async () => {
                    // Stop the queries that may affect this operation
                    await queryClient.cancelQueries(queryKey)

                    const prevData =
                        queryClient.getQueryData<PostsInfiniteData>(queryKey)

                    const updatedPages = prevData?.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((paginatedPost) => {
                            const connected =
                                paginatedPost.user.connections.includes(
                                    user._id
                                )

                            const updatedConnections = connected
                                ? paginatedPost.user.connections.filter(
                                      (userLike) => userLike !== user._id
                                  )
                                : [...paginatedPost.user.connections, user._id]

                            return {
                                ...paginatedPost,
                                user: {
                                    ...paginatedPost.user,
                                    connections: updatedConnections,
                                },
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
                onClick={() => navigate(`/posts/${post._id}`)}
                ref={ref}
                className="card md:max-w-full cursor-pointer"
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
