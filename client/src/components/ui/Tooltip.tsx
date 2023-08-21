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
                className={`border text-sm absolute bottom-[110%] -translate-x-1/2 left-1/2 w-max border-neutral-500 py-2 px-3 
                rounded-md bg-neutral-50 transition-all shadow-md
                ${
                    visible
                        ? "pointer-events-auto opacity-100 scale-100 translate-y-0"
                        : "pointer-events-none opacity-0 scale-90 translate-y-1"
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
