import { useAuth } from "@/hooks/useAuth"
import { Comment, PaginatedData, Post } from "@/types"
import {
    formatRelativeDate,
    formatNumber,
    optimisticallyUpdatedConnections,
} from "@/lib/utils"
import location from "@/assets/location-small.svg"
import link from "@/assets/link.svg"
import trash from "@/assets/trash.svg"
import linkWhite from "@/assets/link-white.svg"
import heartFill from "@/assets/heart-fill.svg"
import { AvatarSkeleton, Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { DotSeparator } from "../ui/DotSeparator"
import { LikeButton } from "../ui/LikeButton"
import { Skeleton } from "../ui/Skeleton"
import { Tooltip } from "../ui/Tooltip"
import { forwardRef } from "react"
import {
    InfiniteData,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query"
import { deleteComment, likeComment } from "@/api/comments"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useStore } from "@/stores/useStore"
import { DropdownMenu, DropdownMenuOptions } from "../ui/DropdownMenu"
import { toggleConnect } from "@/api/users"
import { Link } from "react-router-dom"
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn"

type PostCommentProps = {
    comment: Comment
    post: Post
}

type CommentsInfiniteData = InfiniteData<PaginatedData<Comment, "comments">>

const PostComment = forwardRef<HTMLDivElement, PostCommentProps>(
    ({ comment, post }, ref) => {
        const user = useAuth()

        const { isLoggedIn } = useIsLoggedIn()

        const { openToast } = useStore()

        const queryClient = useQueryClient()

        const queryKey = ["posts", post._id, "comments"]

        const { error, mutate: onLike } = useMutation(
            () => likeComment({ postId: post._id, commentId: comment._id }),
            {
                onMutate: async () => {
                    // Stop the queries that may affect this operation
                    await queryClient.cancelQueries(queryKey)

                    const prevData =
                        queryClient.getQueryData<CommentsInfiniteData>(queryKey)

                    const updatedPages = prevData?.pages.map((page) => ({
                        ...page,
                        comments: page.comments.map((paginatedComment) => {
                            if (paginatedComment._id !== comment._id) {
                                return paginatedComment
                            }

                            const liked = paginatedComment.likes.includes(
                                user!._id
                            )

                            const updatedLikes = liked
                                ? paginatedComment.likes.filter(
                                      (userLike) => userLike !== user!._id
                                  )
                                : [...paginatedComment.likes, user!._id]

                            return {
                                ...paginatedComment,
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
                        queryClient.setQueryData<CommentsInfiniteData>(
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
            (commentUserId: string) =>
                toggleConnect({
                    userId: user!._id,
                    connectionId: commentUserId,
                }),
            {
                onMutate: async (commentUserId) => {
                    // Stop the queries that may affect this operation
                    await queryClient.cancelQueries(queryKey)

                    const prevData =
                        queryClient.getQueryData<CommentsInfiniteData>(queryKey)

                    if (prevData) {
                        const updatedPages = prevData.pages.map((page) => ({
                            ...page,
                            comments: page.comments.map((paginatedComment) => {
                                const updatedConnections =
                                    optimisticallyUpdatedConnections(
                                        paginatedComment
                                    )

                                return {
                                    ...paginatedComment,
                                    user:
                                        paginatedComment.user._id ===
                                        commentUserId
                                            ? {
                                                  ...paginatedComment.user,
                                                  connections:
                                                      updatedConnections,
                                              }
                                            : paginatedComment.user,
                                }
                            }),
                        }))

                        queryClient.setQueryData(queryKey, {
                            ...prevData,
                            pages: updatedPages,
                        })
                    }

                    return {
                        prevData,
                    }
                },
                onError: (_error, _postId, context) => {
                    if (context?.prevData) {
                        queryClient.setQueryData<CommentsInfiniteData>(
                            queryKey,
                            context.prevData
                        )
                    }
                },
                onSuccess: () => {
                    queryClient.invalidateQueries(queryKey)
                    queryClient.invalidateQueries(["users", user!._id])
                },
            }
        )

        const {
            error: deleteError,
            isLoading,
            mutate: onDelete,
        } = useMutation(
            () => deleteComment({ postId: post._id, commentId: comment._id }),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries([
                        "posts",
                        post._id,
                        "comments",
                    ])
                    openToast({ text: "Comment deleted!" })
                },
            }
        )

        useErrorToast(error)
        useErrorToast(connectError)
        useErrorToast(deleteError)

        const dropdownMenuOptions: DropdownMenuOptions = [
            {
                component: (
                    <span className="flex items-center gap-2 text-danger-400">
                        <img
                            src={trash}
                            alt="trash"
                        />
                        Delete
                    </span>
                ),
                onClick: () => onDelete(),
                isLoading,
            },
        ]

        const isConnected = user && comment.user.connections.includes(user._id)

        return (
            <div
                ref={ref}
                className="max-w-full gap-4 p-3 shadow-none card rounded-xl md:p-5 from-white to-white"
            >
                <header className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Link to={`/users/${comment.user._id}`}>
                            <Avatar
                                src={comment.user.profileImageUrl}
                                alt={comment.user.fullName}
                            />
                        </Link>
                        <div>
                            <p className="font-bold leading-5">
                                <Link
                                    to={`/users/${comment.user._id}`}
                                    className="hidden sm:inline-block hover:underline"
                                >
                                    {comment.user.fullName}
                                </Link>
                                <DotSeparator className="hidden mr-1 sm:inline-block" />
                                <Link
                                    to={`/users/${comment.user._id}`}
                                    className="text-sm sm:text-neutral-800 sm:font-light hover:underline"
                                >
                                    @{comment.user.username}
                                </Link>
                            </p>{" "}
                            <p className="text-sm text-neutral-800">
                                {formatRelativeDate(comment.createdAt)}{" "}
                                <DotSeparator className="m-0" />{" "}
                                <img
                                    className="inline mb-1 mr-1"
                                    src={location}
                                    alt="location"
                                />
                                {comment.user.location ?? "Earth"}
                            </p>
                        </div>
                    </div>
                    {user?._id !== comment.user._id ? (
                        <Tooltip text={isConnected ? "Disconnect" : "Connect"}>
                            <Button
                                variant={isConnected ? "iconActive" : "icon"}
                                onClick={(e) => {
                                    e.preventDefault()
                                    isLoggedIn(() =>
                                        onToggleConnect(comment.user._id)
                                    )
                                }}
                            >
                                {isConnected ? (
                                    <img
                                        src={linkWhite}
                                        alt="disconnect"
                                    />
                                ) : (
                                    <img
                                        src={link}
                                        alt="connect"
                                    />
                                )}
                            </Button>
                        </Tooltip>
                    ) : (
                        <DropdownMenu
                            variant="dark"
                            options={dropdownMenuOptions}
                        />
                    )}
                </header>
                <p>{comment.body}</p>
                <div className="flex items-center">
                    <LikeButton
                        onLike={onLike}
                        liked={
                            user && comment.likes.includes(user._id)
                                ? true
                                : false
                        }
                    />
                    <p className="mr-auto">
                        {" "}
                        <DotSeparator /> {formatNumber(comment.likes.length)}
                    </p>
                </div>
            </div>
        )
    }
)

const PostCommentSkeleton = () => {
    return (
        <Skeleton className="max-w-full gap-2 p-5 shadow-none card rounded-xl from-white to-white">
            <header className="flex items-center gap-2">
                <AvatarSkeleton />
                <div>
                    <span>
                        <Skeleton className="h-2 w-[8rem] inline-block" />
                        <DotSeparator className="mr-1" />
                        <Skeleton className="h-2 w-[5rem] inline-block" />
                    </span>{" "}
                    <br />
                    <span className="text-sm text-neutral-800">
                        <Skeleton className="h-2 w-[5rem] inline-block" />
                        <DotSeparator className="ml-2 mr-0" />{" "}
                        <img
                            className="inline mb-1 mr-1"
                            src={location}
                            alt="location"
                        />
                        <Skeleton className="h-2 w-[4rem] inline-block" />
                    </span>
                </div>
            </header>

            <Skeleton className="w-full h-2 mt-4" />
            <Skeleton className="h-2 w-[90%]" />

            <div className="flex items-center mt-5">
                <img
                    src={heartFill}
                    alt="heart"
                />
                <span className="mr-auto">
                    {" "}
                    <DotSeparator />{" "}
                    <Skeleton className="h-2 w-[2rem] inline-block" />
                </span>
            </div>
        </Skeleton>
    )
}

export { PostComment, PostCommentSkeleton }
