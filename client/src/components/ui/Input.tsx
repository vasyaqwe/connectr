import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

type InputProps = ComponentProps<"input"> & {
    invalid?: string
    className?: string
}

export const Input = ({ invalid, className = "", ...rest }: InputProps) => {
    const style = invalid
        ? "outline outline-[2px] outline-offset-2 outline-danger-400"
        : "focus"

    return (
        <>
            <input
                className={cn(
                    `input bg-primary-800 block rounded-md 
                        border px-3 py-2 text-neutral-900 
                ${
                    invalid
                        ? " outline outline-[2px] outline-offset-2 outline-danger-400"
                        : "focus"
                }
                `,
                    style,
                    className
                )}
                {...rest}
            />
            {invalid && invalid !== "nomessage" && (
                <p className={`mt-1 text-danger-400`}>{invalid}</p>
            )}
        </>
    )
}
