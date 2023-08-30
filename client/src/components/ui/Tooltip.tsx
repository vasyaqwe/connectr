import { cn } from "@/lib/utils"
import { ComponentProps, ReactNode, useState } from "react"

type TooltipProps = ComponentProps<"div"> & {
    children: ReactNode
    text: string
    className?: string
}

export const Tooltip = ({
    children,
    text,
    className = "",
    ...rest
}: TooltipProps) => {
    const [visible, setVisible] = useState(false)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
        undefined
    )

    const onMouseOver = () => {
        clearTimeout(timeoutId) // Clear any ongoing timeout
        const id = setTimeout(() => {
            setVisible(true)
        }, 800)
        setTimeoutId(id)
    }

    const onMouseLeave = () => {
        clearTimeout(timeoutId)
        setVisible(false)
    }

    const onMouseEnter = () => {
        clearTimeout(timeoutId)
    }

    return (
        <div
            {...rest}
            className={cn("relative", className)}
            onMouseEnter={onMouseEnter} // Clear timeout on mouse enter
        >
            <p
                className={`absolute bottom-[110%] left-1/2 w-max -translate-x-1/2 rounded-md border border-neutral-500 bg-neutral-50 px-3 
                py-2 text-sm shadow-md transition-all
                ${
                    visible
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none translate-y-1 scale-90 opacity-0"
                }
            `}
            >
                {text}
            </p>
            <span
                onClick={() => setVisible(false)}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </span>
        </div>
    )
}
