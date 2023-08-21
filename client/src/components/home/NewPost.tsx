import { Button } from "../ui/Button"
import { Textarea } from "../ui/Textarea"
import image from "@/assets/image.svg"
import { Tooltip } from "../ui/Tooltip"
import { FileInput } from "../ui/FileInput"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { createPost } from "@/api/posts"
import { useStore } from "@/stores/useStore"
import { PostFormData } from "@/types"
import { AnimatePresence, motion } from "framer-motion"

export const NewPost = () => {
    const { openToast } = useStore()

    const [formData, setFormData] = useState<PostFormData>({
        body: "",
        image: undefined,
    })

    const queryClient = useQueryClient()
    const postRef = useRef<HTMLTextAreaElement | null>(null)

    const {
        isLoading,
        error,
        mutate: onSubmit,
    } = useMutation(
        () =>
            createPost({
                post: { body: postRef?.current?.value ?? "" },
            }),
        {
            onSuccess: () => {
                if (postRef.current) {
                    postRef.current.value = ""
                }
                setFormData(() => ({ image: undefined, body: "" }))
                queryClient.invalidateQueries(["posts"])
                openToast({ text: "New post created" })
            },
        }
    )

    useErrorToast(error)

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null || e.target.files.length === 0) return

        setFormData((prev) => ({
            ...prev,
            image: e.target.files![0],
        }))
    }

    return (
        <div className="card md:max-w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit()
                }}
                className="w-full"
            >
                <Textarea
                    ref={postRef}
                    required
                    value={formData.body}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            body: e.target.value,
                        }))
                    }
                    name="body"
                    className="w-full min-h-[5rem]"
                    placeholder="Share what's on your mind..."
                ></Textarea>
                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                        <Tooltip text="Attach an image">
                            <FileInput onChange={onImageChange}>
                                <img
                                    src={image}
                                    alt="image"
                                />
                            </FileInput>
                        </Tooltip>
                        {formData.image && (
                            <Button
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        image: undefined,
                                    }))
                                }
                                type="button"
                                variant="link"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    <Button
                        disabled={isLoading || formData.body.trim().length < 1}
                        isLoading={isLoading}
                        className="ml-auto mt-3"
                    >
                        Post
                    </Button>
                </div>
                <AnimatePresence>
                    {formData?.image && (
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mx-auto mt-4"
                            src={URL.createObjectURL(formData.image)}
                        />
                    )}
                </AnimatePresence>
            </form>
        </div>
    )
}
