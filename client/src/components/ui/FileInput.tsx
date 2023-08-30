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
                `focus grid h-8 w-8 cursor-pointer
                     place-items-center justify-center rounded-md border bg-neutral-50 transition-colors
          duration-100 ease-out hover:bg-neutral-450 focus-visible:bg-neutral-450`,
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
