import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

type ShellProps = React.ComponentProps<"div"> & {
    children: ReactNode
}

export const Shell = ({ className = "", children, ...rest }: ShellProps) => {
    return (
        <div
            {...rest}
            className={cn(
                `grid gap-4 lg:grid-cols-[40%,1fr] md:gap-6 xl:grid-cols-[30%,1fr,25%] items-start`,
                className
            )}
        >
            {children}
        </div>
    )
}
