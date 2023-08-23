import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useIntersection } from "@mantine/hooks"
import { ProfileCard } from "@/components/ProfileCard"
import { getPosts } from "@/api/posts"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Spinner } from "@/components/ui/Spinner"
import { DecodedToken, Post as PostType } from "@/types"
import { PostSkeleton } from "@/components/Post"
import { Post } from "@/components/home/Post"
import { NewPost } from "@/components/home/NewPost"
import { safeError } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { SuggestionsCard } from "@/components/SuggestionsCard"
import { Shell } from "@/components/ui/Shell"

export const Home = () => {
    const user = useAuth() as DecodedToken

    const lastPostRef = useRef<HTMLDivElement>(null)

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
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
        ["posts"],
        ({ pageParam = 1 }) => getPosts(pageParam),
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

    const posts = data?.pages.flatMap((page) => page.posts) ?? []

    return (
        <Shell>
            <ProfileCard userId={user._id} />
            {error ? (
                <ErrorMessage message={safeError(error)} />
            ) : (
                <div className="flex flex-col gap-3 pb-8">
                    <NewPost />
                    {isLoading ? (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : posts.length < 1 ? (
                        <p className="mx-4 mt-8 text-lg font-semibold">
                            Be the first to post something.
                        </p>
                    ) : (
                        posts.map((post: PostType, idx) => {
                            if (posts.length === idx + 1) {
                                return (
                                    <Post
                                        key={post._id}
                                        ref={ref}
                                        post={post}
                                    />
                                )
                            }
                            return (
                                <Post
                                    key={post._id}
                                    ref={ref}
                                    post={post}
                                />
                            )
                        })
                    )}
                    {isFetchingNextPage && (
                        <Spinner className="self-center mt-3" />
                    )}
                </div>
            )}
            <SuggestionsCard />
        </Shell>
    )
}
