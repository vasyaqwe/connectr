import { useAuth } from "@/hooks/useAuth"
import { DecodedToken, Post } from "@/types"
import { formatRelativeDate, formatNumber } from "@/lib/utils"
import location from "@/assets/location-small.svg"
import link from "@/assets/link.svg"
import trash from "@/assets/trash.svg"
import linkWhite from "@/assets/link-white.svg"
import chatFill from "@/assets/chat-fill.svg"
import heartFill from "@/assets/heart-fill.svg"
import chatOutline from "@/assets/chat-outline.svg"
import { AvatarSkeleton, Avatar } from "./ui/Avatar"
import { Button } from "./ui/Button"
import { DotSeparator } from "./ui/DotSeparator"
import { LikeButton } from "./ui/LikeButton"
import { Skeleton } from "./ui/Skeleton"
import { Tooltip } from "./ui/Tooltip"
import { useLocation, useNavigate } from "react-router-dom"
import { NewPostCommentSkeleton } from "./postDetails/NewPostComment"
import { DropdownMenu, DropdownMenuOptions } from "./ui/DropdownMenu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "@/api/posts"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useStore } from "@/stores/useStore"

const PostSkeleton = () => {
    const { pathname } = useLocation()

    const isOnPostDetailPage = pathname.includes("posts")

    return (
        <Skeleton className="md:max-w-full card rounded-2xl gap-3">
            <header className="flex items-center gap-2">
                <AvatarSkeleton />
                <div>
                    <span>
                        <Skeleton className="h-2 w-[8rem] inline-block" />
                        <DotSeparator className="mr-1" />
                        <Skeleton className="h-2 w-[5rem] inline-block" />
                    </span>{" "}
                    <br />
                    <span className="text-neutral-800 text-sm">
                        <Skeleton className="h-2 w-[5rem] inline-block" />
                        <DotSeparator className="ml-2 mr-1" />{" "}
                        <img
                            className="inline mb-1 mr-1"
                            src={location}
                            alt="location"
                        />
                        <Skeleton className="h-2 w-[4rem] inline-block" />
                    </span>
                </div>
            </header>

            <Skeleton className="h-2 w-full mt-4" />
            <Skeleton className="h-2 w-[90%]" />
            <Skeleton className="h-2 w-[80%]" />

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
                <Skeleton className="h-2 w-[2rem]" />
                <DotSeparator className="mr-1" />

                <img
                    src={chatFill}
                    alt="comments"
                />
            </div>
            {isOnPostDetailPage && <NewPostCommentSkeleton />}
        </Skeleton>
    )
}

const PostHeader = ({
    post,
    onToggleConnect,
}: {
    post: Post
    onToggleConnect: () => void
}) => {
    const user = useAuth() as DecodedToken

    const { openToast } = useStore()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const queryClient = useQueryClient()

    const {
        error,
        isLoading,
        mutate: onDelete,
    } = useMutation(() => deletePost(post._id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["posts", post._id])
            queryClient.invalidateQueries(["posts"])
            openToast({ text: "Post deleted!" })
            if (pathname.includes("posts")) navigate("/")
        },
    })

    useErrorToast(error)

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

    const isConnected = post.user.connections.includes(user._id)

    return (
        <header className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
                <Avatar
                    src={post.user.profileImageUrl}
                    alt={post.user.fullName}
                />
                <div>
                    <p className="font-bold leading-5">
                        <span className="hidden lg:inline-block">
                            {post.user.fullName}
                            <DotSeparator className="mr-1" />
                        </span>
                        <span className="lg:text-neutral-800 font-light">
                            @{post.user.username}
                        </span>
                    </p>{" "}
                    <p className="text-neutral-800 text-sm">
                        {formatRelativeDate(post.createdAt)}{" "}
                        <DotSeparator className="mr-1" />{" "}
                        <img
                            className="inline mb-1 mr-1"
                            src={location}
                            alt="location"
                        />
                        {post.user.location ?? "Earth"}
                    </p>
                </div>
            </div>
            {user._id !== post.user._id ? (
                <Tooltip text={isConnected ? "Disconnect" : "Connect"}>
                    <Button
                        variant={isConnected ? "iconActive" : "icon"}
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleConnect()
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
                <DropdownMenu options={dropdownMenuOptions} />
            )}
        </header>
    )
}

const PostBody = ({ post }: { post: Post }) => {
    return (
        <>
            <p
                className="w-fit cursor-text"
                onClick={(e) => e.stopPropagation()}
            >
                {post.body}
            </p>
            {post.image && (
                <img
                    className="self-start rounded-md"
                    src={post.image.path}
                    alt={post.body}
                />
            )}
        </>
    )
}

const PostFooter = ({ post, onLike }: { post: Post; onLike: () => void }) => {
    const user = useAuth() as DecodedToken

    return (
        <div className="flex items-center">
            <LikeButton
                onLike={onLike}
                liked={post.likes.includes(user._id)}
            />
            <p className="mr-auto">
                {" "}
                <DotSeparator /> {formatNumber(post.likes.length)}
            </p>
            {formatNumber(post.comments.length)}
            <DotSeparator className="mr-1" />
            <Button
                onClick={() => {
                    const textarea =
                        document.querySelector<HTMLTextAreaElement>(
                            "#new-post-comment"
                        )
                    if (textarea) textarea.focus()
                }}
                variant="icon"
            >
                {post.comments.length === 0 ? (
                    <img
                        src={chatOutline}
                        alt="comments"
                    />
                ) : (
                    <img
                        src={chatFill}
                        alt="comments"
                    />
                )}
            </Button>
        </div>
    )
}

export { PostSkeleton, PostHeader, PostBody, PostFooter }
