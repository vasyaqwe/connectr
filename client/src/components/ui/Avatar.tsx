import { Skeleton } from "./Skeleton"

const Avatar = ({ src, alt = "" }: { src: string; alt: string }) => {
    return (
        <img
            src={src}
            alt={alt}
            className="rounded-full w-10 h-10"
        />
    )
}

const AvatarSkeleton = () => {
    return <Skeleton className="rounded-full w-10 h-10 "></Skeleton>
}

export { Avatar, AvatarSkeleton }
