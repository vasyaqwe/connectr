import { Avatar, AvatarSkeleton } from "./ui/Avatar"
import location from "@/assets/location.svg"
import bio from "@/assets/file-person.svg"
import link from "@/assets/link.svg"
import eye from "@/assets/eye.svg"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/api/users"
import { Skeleton } from "./ui/Skeleton"
import { ErrorMessage } from "./ui/ErrorMessage"
import { safeError } from "@/lib/utils"

const ProfileCard = ({ userId }: { userId: string }) => {
    const { isLoading, error, data } = useQuery(
        ["users", userId],
        () => getUser(userId),
        {
            refetchInterval: 50000,
        }
    )

    return (
        <div className="hidden lg:block">
            {error ? (
                <div className="card">
                    <ErrorMessage message={safeError(error)} />
                </div>
            ) : isLoading ? (
                <ProfileCardSkeleton />
            ) : (
                <div className="card items-start ">
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={data.profileImageUrl}
                            alt={data.fullName}
                        />
                        <div>
                            <p className="font-semibold text-lg leading-5">
                                {data.fullName}
                            </p>
                            <p className="text-neutral-800 text-sm">
                                @{data.username}
                            </p>
                        </div>
                    </div>
                    <p className="flex items-start gap-2">
                        <img
                            src={location}
                            alt="location"
                        />
                        {data.location ?? "Earth"}
                    </p>
                    {data.bio && (
                        <p className="flex items-start gap-2">
                            <img
                                className="mt-1"
                                src={bio}
                                alt="bio"
                            />
                            {data.bio}
                        </p>
                    )}
                    <p className="flex items-center gap-2">
                        <img
                            src={link}
                            alt="link"
                        />
                        {data.connections.length}
                        {data.connections.length === 1
                            ? " connection"
                            : " connections"}
                    </p>
                    <p className="flex items-center gap-2">
                        <img
                            src={eye}
                            alt="eye"
                        />
                        {data.profileViews}
                        {data.profileViews === 1
                            ? " profile view"
                            : " profile views"}
                    </p>
                </div>
            )}
        </div>
    )
}

const ProfileCardSkeleton = () => {
    return (
        <Skeleton className="card rounded-2xl gap-3">
            <div className="flex items-center gap-3 mb-4">
                <AvatarSkeleton />
                <div>
                    <Skeleton className="w-[10rem] mb-3 h-3 " />
                    <Skeleton className="w-[7rem] h-3 " />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <img
                    src={location}
                    alt="location"
                />
                <Skeleton className="w-[10rem] h-3 " />
            </div>
            <div className="flex items-start gap-2">
                <img
                    className=""
                    src={bio}
                    alt="bio"
                />
                <div className="w-full">
                    <Skeleton className="w-full h-3 mb-2" />
                    <Skeleton className="w-[80%] h-3 " />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <img
                    src={link}
                    alt="link"
                />
                <Skeleton className="w-[10rem] h-3 " />
            </div>
            <div className="flex items-center gap-2">
                <img
                    src={eye}
                    alt="eye"
                />
                <Skeleton className="w-[10rem] h-3 " />
            </div>
        </Skeleton>
    )
}

export { ProfileCard }
