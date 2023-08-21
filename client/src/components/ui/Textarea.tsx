import { cn } from "@/lib/utils"
import { ComponentPropsWithRef, forwardRef } from "react"

type TextareaProps = ComponentPropsWithRef<"textarea"> & {
    invalid?: boolean
    className?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ invalid = false, className = "", ...rest }, ref) => {
        const style = invalid
            ? "outline outline-[2px] outline-offset-2 outline-danger-400"
            : "focus:outline-none focus:outline-accent-300"

        return (
            <textarea
                ref={ref}
                className={cn(
                    `input block border bg-primary-800 
                        rounded-md py-2 px-3 text-neutral-900 
                ${
                    invalid
                        ? " outline outline-[2px] outline-offset-2 outline-danger-400"
                        : "focus:outline-none focus:outline-accent-300"
                }
                `,
                    style,
                    className
                )}
                {...rest}
            />
        )
    }
)
