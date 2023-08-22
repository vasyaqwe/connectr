import { createComment } from "@/api/comments"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../ui/Button"
import { Textarea } from "../ui/Textarea"
import { useRef, useState } from "react"
import { Post } from "@/types"
import { Skeleton } from "../ui/Skeleton"
import { useStore } from "@/stores/useStore"

const NewPostComment = ({ post }: { post: Post }) => {
    const { openToast } = useStore()

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
                onPostComment()
            }}
            className="border-t border-neutral-600 pt-5 relative"
        >
            <Textarea
                id="new-post-comment"
                required
                value={formData.body}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                ref={commentRef}
                className="w-full min-h-[7rem]"
                placeholder="Post a comment"
            ></Textarea>
            <Button
                disabled={postCommentLoading || formData.body.trim().length < 1}
                isLoading={postCommentLoading}
                className="ml-auto mt-3 absolute bottom-3 right-3"
            >
                Post
            </Button>
        </form>
    )
}

const NewPostCommentSkeleton = () => {
    return (
        <Skeleton className="max-w-full border-neutral-200 card rounded-lg min-h-[7rem] shadow-none p-5 from-white to-white" />
    )
}
export { NewPostComment, NewPostCommentSkeleton }
