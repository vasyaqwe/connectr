import { getRandomNumberRange } from "@/lib/utils"
import { AnimationSequence, useAnimate } from "framer-motion"
import { ComponentProps } from "react"
import heartFill from "@/assets/heart-fill.svg"
import heartOutline from "@/assets/heart-outline.svg"
import { Button } from "./Button"

type LikeButtonProps = ComponentProps<"button"> & {
    liked: boolean
    onLike: () => void
}

export const LikeButton = ({ onLike, liked, ...rest }: LikeButtonProps) => {
    const [scope, animate] = useAnimate()

    const onLikeClick = () => {
        const hearts = Array.from({ length: 15 })
        const heartsAnimation: AnimationSequence = hearts.map((_, idx) => [
            `.heart-${idx}`,
            {
                x: getRandomNumberRange(-30, 30),
                y: getRandomNumberRange(-30, 30),
                scale: getRandomNumberRange(1, 2.5),
                opacity: 1,
            },
            {
                duration: 0.4,
                at: "<",
            },
        ])

        const heartsFadeOut: AnimationSequence = hearts.map((_, index) => [
            `.heart-${index}`,
            {
                opacity: 0,
                scale: 0,
            },
            {
                duration: 0.3,
                delay: 0.4,
                at: "<",
            },
        ])

        const heartsReset: AnimationSequence = hearts.map((_, index) => [
            `.heart-${index}`,
            {
                x: 0,
                y: 0,
            },
            {
                duration: 0.0001,
            },
        ])

        if (!liked) {
            animate([...heartsReset, ...heartsAnimation, ...heartsFadeOut])
        }
        onLike()
    }

    return (
        <Button
            variant="icon"
            {...rest}
            ref={scope}
            className="relative isolate"
            onClick={(e) => {
                e.stopPropagation()
                onLikeClick()
            }}
        >
            {liked ? (
                <img
                    src={heartFill}
                    alt="filled heart - liked"
                />
            ) : (
                <img
                    src={heartOutline}
                    alt="outlined heart - not liked"
                />
            )}

            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[99] block"
            >
                {Array.from({ length: 15 }).map((_, idx) => (
                    <svg
                        key={idx}
                        xmlns="http://www.w3.org/2000/svg"
                        width="4"
                        height="4"
                        className={`absolute left-1/2 top-1/2 z-[2] opacity-0 heart-${idx}`}
                        viewBox="0 0 16 16"
                    >
                        <path
                            className="fill-danger-400"
                            fillRule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                        />
                    </svg>
                ))}
            </span>
        </Button>
    )
}
