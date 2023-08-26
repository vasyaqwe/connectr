import { cn } from "@/lib/utils"
import { ComponentProps, ReactNode, useRef } from "react"

type InputProps = ComponentProps<"input"> & {
    className?: string
    children: ReactNode
}

export const FileInput = ({
    className = "",
    children,
    ...rest
}: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const onKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            inputRef.current?.click()
        }
    }

    return (
        <label
            onKeyDown={onKeyDown}
            role="button"
            aria-controls="image"
            tabIndex={0}
            htmlFor="image"
            className={cn(
                `border duration-100 ease-out cursor-pointer bg-neutral-50
                     focus-visible:bg-neutral-450 focus w-8 h-8 grid place-items-center
          hover:bg-neutral-450 transition-colors rounded-md justify-center`,
                className
            )}
        >
            <input
                ref={inputRef}
                name="image"
                id="image"
                type="file"
                className={`hidden`}
                {...rest}
            />
            {children}
        </label>
    )
}
