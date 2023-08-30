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
                `mt-8 grid items-start gap-4 md:gap-6 lg:grid-cols-[40%,1fr] xl:grid-cols-[30%,1fr,25%]`,
                className
            )}
        >
            {children}
        </div>
    )
}
