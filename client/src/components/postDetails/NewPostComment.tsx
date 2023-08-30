import { createComment } from "@/api/comments"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../ui/Button"
import { Textarea } from "../ui/Textarea"
import { useRef, useState } from "react"
import { Post } from "@/types"
import { Skeleton } from "../ui/Skeleton"
import { useStore } from "@/stores/useStore"
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn"

const NewPostComment = ({ post }: { post: Post }) => {
    const { openToast } = useStore()

    const { isLoggedIn } = useIsLoggedIn()

    const [formData, setFormData] = useState({
        body: "",
    })

    const queryClient = useQueryClient()

    const commentRef = useRef<HTMLTextAreaElement | null>(null)

    const {
        isLoading: postCommentLoading,
        error: postCommentError,
        mutate: onPostComment,
    } = useMutation(
        () =>
            createComment({
                postId: post._id,
                comment: { body: commentRef?.current?.value ?? "" },
            }),
        {
            onSuccess: () => {
                if (commentRef.current) {
                    commentRef.current.value = ""
                }
                queryClient.invalidateQueries(["posts", post._id])
                setFormData((prev) => ({ ...prev, body: "" }))
                openToast({ text: "New comment created" })
            },
        }
    )

    useErrorToast(postCommentError)

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                isLoggedIn(onPostComment)
            }}
            className="relative border-t border-neutral-600 pt-5"
        >
            <Textarea
                id="new-post-comment"
                required
                value={formData.body}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                ref={commentRef}
                className="min-h-[7rem] w-full"
                placeholder="Post a comment"
            ></Textarea>
            <Button
                disabled={postCommentLoading || formData.body.trim().length < 1}
                isLoading={postCommentLoading}
                className="absolute bottom-3 right-3 ml-auto mt-3"
            >
                Post
            </Button>
        </form>
    )
}

const NewPostCommentSkeleton = () => {
    return (
        <Skeleton className="card min-h-[7rem] max-w-full rounded-lg border-neutral-200 from-white to-white p-5 shadow-none" />
    )
}
export { NewPostComment, NewPostCommentSkeleton }
