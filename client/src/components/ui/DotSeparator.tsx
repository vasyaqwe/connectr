import { cn } from "@/lib/utils"

export const DotSeparator = ({ className = "" }) => {
    return <span className={cn(`ml-1 text-base font-bold`, className)}>·</span>
}
