import { Skeleton } from "./Skeleton"

const Avatar = ({ src, alt = "" }: { src: string; alt: string }) => {
    return (
        <img
            src={src}
            alt={alt}
            className="w-10 h-10 border rounded-full border-accent-300"
        />
    )
}

const AvatarSkeleton = () => {
    return <Skeleton className="w-10 h-10 rounded-full "></Skeleton>
}

export { Avatar, AvatarSkeleton }
