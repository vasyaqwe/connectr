import { useQuery } from "@tanstack/react-query"
import { ProfileCard } from "@/components/ProfileCard"
import { getPost } from "@/api/posts"
import { Post } from "@/components/postDetails/Post"
import { Link, Navigate, useParams } from "react-router-dom"
import arrow from "@/assets/arrow.svg"
import { PostSkeleton } from "@/components/Post"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useAuth } from "@/hooks/useAuth"
import { DecodedToken } from "@/types"

export const PostDetails = () => {
    const { id } = useParams()

    const user = useAuth() as DecodedToken

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
        <div className="grid gap-4 md:grid-cols-[40%,1fr] md:gap-10 xl:grid-cols-[30%,1fr,15%] items-start">
            <ProfileCard userId={user._id} />
            <div className="pb-8 grid gap-3">
                <Link
                    to={".."}
                    className="link w-fit flex items-center gap-1"
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
        </div>
    )
}
