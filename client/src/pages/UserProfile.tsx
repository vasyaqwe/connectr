import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
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
import { getUserPosts, viewUserProfile } from "@/api/users"
import arrow from "@/assets/arrow.svg"
import { useAuth } from "@/hooks/useAuth"
import { NewPost } from "@/components/home/NewPost"
import { Shell } from "@/components/ui/Shell"
import { SuggestionsCard } from "@/components/SuggestionsCard"

export const UserProfile = () => {
    const user = useAuth()
    const { id } = useParams()

    const navigate = useNavigate()

    useQuery(["users", id], () => viewUserProfile(id!), {
        refetchOnWindowFocus: false,
        retry: false,
    })

    useEffect(() => {
        const viewProfile = async () => {
            await viewUserProfile(id!)
        }
        if (user?._id !== id) {
            viewProfile()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        ["users", id, "posts"],
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
        <Shell>
            <ProfileCard userId={id!} />
            {error ? (
                <ErrorMessage message={safeError(error)} />
            ) : (
                <div className="flex flex-col gap-3 pb-8">
                    <button
                        role="link"
                        onClick={() => navigate(-1)}
                        className="link flex w-fit items-center gap-1"
                    >
                        <img
                            className="rotate-180"
                            src={arrow}
                            alt="back"
                        />
                        Back
                    </button>
                    {user?._id === id && <NewPost />}
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
                            No posts yet.
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
                        <Spinner className="mt-3 self-center" />
                    )}
                </div>
            )}
            <SuggestionsCard />
        </Shell>
    )
}
