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
                    `input block border bg-primary-800 
                        rounded-md py-2 px-3 text-neutral-900 
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
                <p className={`text-danger-400 mt-1`}>{invalid}</p>
            )}
        </>
    )
}
