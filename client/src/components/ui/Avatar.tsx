import { Skeleton } from "./Skeleton"

const Avatar = ({ src, alt = "" }: { src: string; alt: string }) => {
    return (
        <img
            src={src}
            alt={alt}
            className="h-10 w-10 rounded-full border border-accent-300"
        />
    )
}

const AvatarSkeleton = () => {
    return <Skeleton className="h-10 w-10 rounded-full "></Skeleton>
}

export { Avatar, AvatarSkeleton }
