import { getPostComments } from "@/api/comments"
import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { PostComment, PostCommentSkeleton } from "./PostComment"
import { Comment, Post } from "@/types"
import { useIntersection } from "@mantine/hooks"
import { Spinner } from "../ui/Spinner"
import { ErrorMessage } from "../ui/ErrorMessage"

type PostCommentsModuleProps = { post: Post; onToggleConnect: () => void }

export const PostCommentsModule = ({
    post,
    onToggleConnect,
}: PostCommentsModuleProps) => {
    const lastCommentRef = useRef<HTMLDivElement>(null)

    const { ref, entry } = useIntersection({
        root: lastCommentRef.current,
        threshold: 1,
    })

    const {
        isLoading,
        error,
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery(
        ["posts", post._id, "comments"],
        ({ pageParam = 1 }) =>
            getPostComments({ postId: post._id, page: pageParam }),
        {
            getNextPageParam: (res, pages) => {
                if (pages.length < res.totalPages) {
                    return pages.length + 1
                } else {
                    return undefined
                }
            },
            refetchOnWindowFocus: false,
            refetchInterval: 50000,
        }
    )

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) fetchNextPage()
    }, [entry, hasNextPage, fetchNextPage])

    const comments = data?.pages.flatMap((page) => page.comments)

    return (
        <>
            {error ? (
                <ErrorMessage
                    message={
                        error && error instanceof Error ? error.message : ""
                    }
                />
            ) : isLoading ? (
                <>
                    <PostCommentSkeleton />
                    <PostCommentSkeleton />
                    <PostCommentSkeleton />
                </>
            ) : (
                comments?.map((comment: Comment, idx) => {
                    if (comments.length === idx + 1) {
                        return (
                            <PostComment
                                key={comment._id}
                                ref={ref}
                                onToggleConnect={onToggleConnect}
                                post={post}
                                comment={comment}
                            />
                        )
                    }
                    return (
                        <PostComment
                            key={comment._id}
                            ref={ref}
                            onToggleConnect={onToggleConnect}
                            post={post}
                            comment={comment}
                        />
                    )
                })
            )}
            {isFetchingNextPage && <Spinner className="self-center" />}
        </>
    )
}
