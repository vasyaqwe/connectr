import { DecodedToken, Post as PostType } from "@/types"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { likePost } from "@/api/posts"
import { useAuth } from "@/hooks/useAuth"
import { forwardRef } from "react"
import { toggleConnect } from "@/api/users"
import { PostHeader, PostBody, PostFooter } from "../Post"
import { PostCommentsModule } from "./PostCommentsModule"
import { NewPostComment } from "./NewPostComment"
import {
    optimisticallyUpdatedConnections,
    optimisticallyUpdatedLikes,
} from "@/lib/utils"

export const Post = forwardRef<HTMLDivElement, { post: PostType }>(
    ({ post }, ref) => {
        const user = useAuth() as DecodedToken

        const queryClient = useQueryClient()

        const queryKey = ["posts", post._id]

        const { error, mutate: onLike } = useMutation(
            () => likePost(post._id),
            {
                onMutate: async () => {
                    // Stop the queries that may affect this operation
                    await queryClient.cancelQueries(["posts", post._id])

                    const prevData =
                        queryClient.getQueryData<PostType>(queryKey)

                    if (prevData) {
                        const updatedLikes =
                            optimisticallyUpdatedLikes(prevData)

                        queryClient.setQueryData(queryKey, {
                            ...prevData,
                            likes: updatedLikes,
                        })
                    }

                    return {
                        prevData,
                    }
                },
                onError: (_error, _postId, context) => {
                    if (context?.prevData) {
                        queryClient.setQueryData<PostType>(
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
                        queryClient.getQueryData<PostType>(queryKey)

                    if (prevData) {
                        const updatedConnections =
                            optimisticallyUpdatedConnections(prevData)

                        queryClient.setQueryData(queryKey, {
                            ...prevData,
                            user: {
                                ...prevData.user,
                                connections: updatedConnections,
                            },
                        })
                    }

                    return {
                        prevData,
                    }
                },
                onError: (_error, _postId, context) => {
                    if (context?.prevData) {
                        queryClient.setQueryData<PostType>(
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
            <div
                ref={ref}
                className="card md:max-w-full"
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
                <NewPostComment post={post} />
                {post.comments.length > 0 && <PostCommentsModule post={post} />}
            </div>
        )
    }
)
