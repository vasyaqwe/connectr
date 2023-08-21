import { cn } from "@/lib/utils"

export const DotSeparator = ({ className = "" }) => {
    return <span className={cn(`text-base font-bold ml-1`, className)}>·</span>
}
