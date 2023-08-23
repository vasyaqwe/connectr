import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useIntersection } from "@mantine/hooks"
import { ProfileCard } from "@/components/ProfileCard"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Spinner } from "@/components/ui/Spinner"
import { Post as PostType } from "@/types"
import { PostSkeleton } from "@/components/Post"
import { Post } from "@/components/home/Post"
import { safeError } from "@/lib/utils"
import { useNavigate, useParams } from "react-router-dom"
import { getUserPosts } from "@/api/users"
import arrow from "@/assets/arrow.svg"

export const UserProfile = () => {
    const { id } = useParams()
    const navigate = useNavigate()

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
        ({ pageParam = 1 }) => getUserPosts({ page: pageParam, id: id! }),
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
        <div className="grid gap-4 lg:grid-cols-[40%,1fr] md:gap-10 xl:grid-cols-[30%,1fr,15%] items-start">
            <ProfileCard userId={id!} />
            {error ? (
                <ErrorMessage message={safeError(error)} />
            ) : (
                <div className="pb-8 flex flex-col gap-3">
                    <button
                        role="link"
                        onClick={() => navigate(-1)}
                        className="link w-fit flex items-center gap-1"
                    >
                        <img
                            className="rotate-180"
                            src={arrow}
                            alt="back"
                        />
                        Back
                    </button>
                    {isLoading ? (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : posts.length < 1 ? (
                        <p className="mt-8 mx-4 text-lg font-semibold">
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
        </div>
    )
}
