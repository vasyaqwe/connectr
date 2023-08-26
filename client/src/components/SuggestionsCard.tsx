import { Avatar, AvatarSkeleton } from "./ui/Avatar"
import location from "@/assets/location-small.svg"
import link from "@/assets/link.svg"
import linkWhite from "@/assets/link-white.svg"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserSuggestions, toggleConnect } from "@/api/users"
import { Skeleton } from "./ui/Skeleton"
import { ErrorMessage } from "./ui/ErrorMessage"
import { safeError } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { User } from "@/types"
import { Link } from "react-router-dom"
import { DotSeparator } from "./ui/DotSeparator"
import { Tooltip } from "./ui/Tooltip"
import { Button } from "./ui/Button"
import { useErrorToast } from "@/hooks/useErrorToast"

const SuggestionsCard = () => {
    const user = useAuth()

    const queryClient = useQueryClient()

    const queryKey = ["users", user?._id, "suggestions"]

    const { isLoading, error, data } = useQuery(
        queryKey,
        () => getUserSuggestions(user!._id),
        {
            enabled: !!user,
            refetchInterval: 50000,
        }
    )

    const { error: connectError, mutate: onToggleConnect } = useMutation(
        (suggestionUserId: string) =>
            toggleConnect({
                userId: user!._id,
                connectionId: suggestionUserId,
            }),
        {
            onMutate: async (suggestionUserId) => {
                // Stop the queries that may affect this operation
                await queryClient.cancelQueries(queryKey)

                const prevData = queryClient.getQueryData<User[]>(queryKey)

                if (prevData) {
                    const updatedSuggestions = prevData.filter(
                        (suggestionUser) =>
                            suggestionUser._id !== suggestionUserId
                    )

                    queryClient.setQueryData(queryKey, updatedSuggestions)
                }

                return {
                    prevData,
                }
            },
            onError: (_error, _postId, context) => {
                if (context?.prevData) {
                    queryClient.setQueryData(queryKey, context.prevData)
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey)
                queryClient.invalidateQueries(["posts"])
            },
        }
    )

    useErrorToast(connectError)

    return user ? (
        <div className="hidden xl:block">
            {error ? (
                <div className="card">
                    <ErrorMessage message={safeError(error)} />
                </div>
            ) : isLoading ? (
                <SuggestionsCardSkeleton />
            ) : (
                <div className="items-start card ">
                    <h2 className="text-xl font-semibold">Suggestions</h2>
                    {data!.length < 1 ? (
                        <p className="text-sm">
                            Connect with more people to get personalized
                            suggestions.
                        </p>
                    ) : (
                        data!.map((suggestedUser) => {
                            const isConnected = [""].includes(suggestedUser._id)
                            return (
                                <div
                                    key={suggestedUser._id}
                                    className="flex items-center w-full gap-2"
                                >
                                    <Link
                                        className="focus"
                                        to={`/users/${suggestedUser._id}`}
                                    >
                                        <Avatar
                                            src={suggestedUser.profileImageUrl}
                                            alt={suggestedUser.fullName}
                                        />
                                    </Link>
                                    <div>
                                        <Link
                                            to={`/users/${suggestedUser._id}`}
                                            className="block text-lg font-semibold leading-5 focus hover:underline"
                                        >
                                            {suggestedUser.fullName}
                                        </Link>
                                        <p className="text-sm text-neutral-800">
                                            <Link
                                                to={`/users/${suggestedUser._id}`}
                                                className="text-sm focus text-neutral-800 hover:underline"
                                            >
                                                @{suggestedUser.username}
                                            </Link>
                                            <DotSeparator className="" />{" "}
                                            <img
                                                className="inline mb-1 mr-1"
                                                src={location}
                                                alt="location"
                                            />
                                            {suggestedUser.location ?? "Earth"}
                                        </p>
                                    </div>
                                    <Tooltip
                                        className="ml-auto"
                                        text={
                                            isConnected
                                                ? "Disconnect"
                                                : "Connect"
                                        }
                                    >
                                        <Button
                                            variant={
                                                isConnected
                                                    ? "iconActive"
                                                    : "icon"
                                            }
                                            onClick={() =>
                                                onToggleConnect(
                                                    suggestedUser._id
                                                )
                                            }
                                        >
                                            {isConnected ? (
                                                <img
                                                    src={linkWhite}
                                                    alt="disconnect"
                                                />
                                            ) : (
                                                <img
                                                    src={link}
                                                    alt="connect"
                                                />
                                            )}
                                        </Button>
                                    </Tooltip>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    ) : null
}

const SuggestionsCardSkeleton = () => {
    return (
        <Skeleton className="gap-3 md:max-w-full card rounded-2xl">
            <Skeleton className="h-5 w-[8rem] inline-block" />
            <SuggestionsCardSkeletonItem />
            <SuggestionsCardSkeletonItem />
            <SuggestionsCardSkeletonItem />
            <SuggestionsCardSkeletonItem />
        </Skeleton>
    )
}

const SuggestionsCardSkeletonItem = () => {
    return (
        <div className="flex items-center gap-2">
            <AvatarSkeleton />
            <div>
                <Skeleton className="h-2 w-[8rem] inline-block" />
                <br />
                <span className="text-sm text-neutral-800">
                    <Skeleton className="h-2 w-[4rem] inline-block" />
                    <DotSeparator className="ml-2 mr-0" />{" "}
                    <img
                        className="inline mb-1 mr-1"
                        src={location}
                        alt="location"
                    />
                    <Skeleton className="h-2 w-[4rem] inline-block" />
                </span>
            </div>
            <Skeleton className="w-8 h-8 ml-auto rounded-md" />
        </div>
    )
}

export { SuggestionsCard }
