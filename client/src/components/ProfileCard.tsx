import { Avatar, AvatarSkeleton } from "./ui/Avatar"
import location from "@/assets/location.svg"
import bio from "@/assets/file-person.svg"
import link from "@/assets/link.svg"
import eye from "@/assets/eye.svg"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/api/users"
import { Skeleton } from "./ui/Skeleton"
import { ErrorMessage } from "./ui/ErrorMessage"
import { guestUser, safeError } from "@/lib/utils"
import { Link } from "react-router-dom"

const ProfileCard = ({ userId }: { userId: string | undefined }) => {
    const { isLoading, error, data, fetchStatus } = useQuery(
        ["users", userId],
        () => getUser(userId!),
        {
            enabled: !!userId,
        }
    )

    const user = userId ? data : guestUser

    return (
        <div className="sticky top-[6rem] hidden lg:block">
            {error ? (
                <div className="card">
                    <ErrorMessage message={safeError(error)} />
                </div>
            ) : isLoading && fetchStatus !== "idle" ? (
                <ProfileCardSkeleton />
            ) : (
                <div className="card items-start ">
                    <div className="flex items-center gap-2">
                        {user?._id === "guest" ? (
                            <Avatar
                                src={user?.profileImageUrl ?? ""}
                                alt={user?.fullName ?? ""}
                            />
                        ) : (
                            <Link
                                className="focus"
                                to={`/users/${user?._id}`}
                            >
                                <Avatar
                                    src={user?.profileImageUrl ?? ""}
                                    alt={user?.fullName ?? ""}
                                />
                            </Link>
                        )}

                        <div>
                            <Link
                                to={`/users/${userId}`}
                                className="focus block text-lg font-semibold leading-5 hover:underline"
                            >
                                {user?.fullName}
                            </Link>
                            <Link
                                to={`/users/${userId}`}
                                className="focus text-sm text-neutral-800 hover:underline"
                            >
                                @{user?.username}
                            </Link>
                        </div>
                    </div>
                    <p className="flex items-start gap-2">
                        <img
                            src={location}
                            alt="location"
                        />
                        {user?.location ?? "Earth"}
                    </p>
                    {user?.bio && (
                        <p className="flex items-start gap-2">
                            <img
                                className="mt-1"
                                src={bio}
                                alt="bio"
                            />
                            {user?.bio}
                        </p>
                    )}
                    <p className="flex items-center gap-2">
                        <img
                            src={link}
                            alt="link"
                        />
                        {user?.connections.length}
                        {user?.connections.length === 1
                            ? " connection"
                            : " connections"}
                    </p>
                    <p className="flex items-center gap-2">
                        <img
                            src={eye}
                            alt="eye"
                        />
                        {user?.profileViews}
                        {user?.profileViews === 1
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
        <Skeleton className="card gap-3 rounded-2xl">
            <div className="mb-4 flex items-center gap-3">
                <AvatarSkeleton />
                <div>
                    <Skeleton className="mb-3 h-3 w-[10rem] " />
                    <Skeleton className="h-3 w-[7rem] " />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <img
                    src={location}
                    alt="location"
                />
                <Skeleton className="h-3 w-[10rem] " />
            </div>
            <div className="flex items-start gap-2">
                <img
                    className=""
                    src={bio}
                    alt="bio"
                />
                <div className="w-full">
                    <Skeleton className="mb-2 h-3 w-full" />
                    <Skeleton className="h-3 w-[80%] " />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <img
                    src={link}
                    alt="link"
                />
                <Skeleton className="h-3 w-[10rem] " />
            </div>
            <div className="flex items-center gap-2">
                <img
                    src={eye}
                    alt="eye"
                />
                <Skeleton className="h-3 w-[10rem] " />
            </div>
        </Skeleton>
    )
}

export { ProfileCard }
