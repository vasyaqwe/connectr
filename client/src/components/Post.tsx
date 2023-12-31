import { useAuth } from "@/hooks/useAuth"
import { Post } from "@/types"
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
import { Link, useLocation, useNavigate } from "react-router-dom"
import { NewPostCommentSkeleton } from "./postDetails/NewPostComment"
import { DropdownMenu, DropdownMenuOptions } from "./ui/DropdownMenu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "@/api/posts"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useStore } from "@/stores/useStore"
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn"

const PostSkeleton = () => {
    const { pathname } = useLocation()

    const isOnPostDetailPage = pathname.includes("posts")

    return (
        <Skeleton className="card gap-3 rounded-2xl md:max-w-full">
            <header className="flex items-center gap-2">
                <AvatarSkeleton />
                <div>
                    <span>
                        <Skeleton className="inline-block h-2 w-[8rem]" />
                        <DotSeparator className="mr-1" />
                        <Skeleton className="inline-block h-2 w-[5rem]" />
                    </span>{" "}
                    <br />
                    <span className="text-sm text-neutral-800">
                        <Skeleton className="inline-block h-2 w-[5rem]" />
                        <DotSeparator className="ml-2 mr-0" />{" "}
                        <img
                            className="mb-1 mr-1 inline"
                            src={location}
                            alt="location"
                        />
                        <Skeleton className="inline-block h-2 w-[4rem]" />
                    </span>
                </div>
            </header>

            <Skeleton className="mt-4 h-2 w-full" />
            <Skeleton className="h-2 w-[90%]" />
            <Skeleton className="h-2 w-[80%]" />

            <div className="mt-5 flex items-center">
                <img
                    src={heartFill}
                    alt="heart"
                />
                <span className="mr-auto">
                    {" "}
                    <DotSeparator />{" "}
                    <Skeleton className="inline-block h-2 w-[2rem]" />
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
    onToggleConnect: (postUserId: string) => void
}) => {
    const user = useAuth()

    const { isLoggedIn } = useIsLoggedIn()

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

    const isConnected = user && post.user.connections.includes(user._id)

    return (
        <header className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Link
                    className="focus"
                    onClick={(e) => e.stopPropagation()}
                    to={`/users/${post.user._id}`}
                >
                    <Avatar
                        src={post.user.profileImageUrl}
                        alt={post.user.fullName}
                    />
                </Link>
                <div>
                    <p className="font-bold leading-5">
                        <Link
                            onClick={(e) => e.stopPropagation()}
                            to={`/users/${post.user._id}`}
                            className="focus hidden hover:underline sm:inline-block"
                        >
                            {post.user.fullName}
                        </Link>
                        <DotSeparator className="mr-1 hidden sm:inline-block" />
                        <Link
                            onClick={(e) => e.stopPropagation()}
                            to={`/users/${post.user._id}`}
                            className="focus font-light hover:underline sm:text-neutral-800"
                        >
                            @{post.user.username}
                        </Link>
                    </p>{" "}
                    <p className="text-sm text-neutral-800">
                        {formatRelativeDate(post.createdAt)}{" "}
                        <DotSeparator className="m-0" />{" "}
                        <img
                            className="mb-1 mr-1 inline"
                            src={location}
                            alt="location"
                        />
                        {post.user.location ?? "Earth"}
                    </p>
                </div>
            </div>
            {user?._id !== post.user._id ? (
                <Tooltip text={isConnected ? "Disconnect" : "Connect"}>
                    <Button
                        variant={isConnected ? "iconActive" : "icon"}
                        onClick={(e) => {
                            e.stopPropagation()
                            isLoggedIn(() => onToggleConnect(post.user._id))
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
    const user = useAuth()

    return (
        <div className="flex items-center">
            <LikeButton
                onLike={onLike}
                liked={user && post.likes.includes(user._id) ? true : false}
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
