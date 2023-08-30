import { useQuery } from "@tanstack/react-query"
import { ProfileCard } from "@/components/ProfileCard"
import { getPost } from "@/api/posts"
import { Post } from "@/components/postDetails/Post"
import { Link, Navigate, useParams } from "react-router-dom"
import arrow from "@/assets/arrow.svg"
import { PostSkeleton } from "@/components/Post"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useAuth } from "@/hooks/useAuth"
import { SuggestionsCard } from "@/components/SuggestionsCard"
import { Shell } from "@/components/ui/Shell"

export const PostDetails = () => {
    const { id } = useParams()

    const user = useAuth()

    const {
        isLoading,
        error,
        data: post,
    } = useQuery(["posts", id], () => getPost(id!), {
        refetchOnWindowFocus: false,
        refetchInterval: 50000,
    })

    useErrorToast(error)

    if (error && error instanceof Error) return <Navigate to={".."} />

    return (
        <Shell>
            <ProfileCard userId={user?._id} />
            <div className="grid gap-3 pb-8">
                <Link
                    to={"/"}
                    className="link flex w-fit items-center gap-1"
                >
                    <img
                        className="rotate-180"
                        src={arrow}
                        alt="back"
                    />
                    Back
                </Link>
                {isLoading ? <PostSkeleton /> : <Post post={post!} />}
            </div>
            <SuggestionsCard />
        </Shell>
    )
}
