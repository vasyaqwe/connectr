import { cn } from "@/lib/utils"

const Skeleton = ({ className, ...rest }: React.ComponentProps<"div">) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-secondary-400",
                className
            )}
            {...rest}
        />
    )
}

export { Skeleton }
