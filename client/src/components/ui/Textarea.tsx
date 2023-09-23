import { cn } from "@/lib/utils"
import { ComponentPropsWithRef, forwardRef } from "react"

type TextareaProps = ComponentPropsWithRef<"textarea"> & {
    invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ invalid = false, className = "", ...rest }, ref) => {
        const style = invalid
            ? "outline outline-[2px] outline-offset-2 outline-danger-400"
            : "focuss:outline-none focus:outline-accent-300"

        return (
            <textarea
                ref={ref}
                className={cn(
                    `input bg-primary-800 block rounded-md 
                        border px-3 py-2 text-neutral-900 
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
