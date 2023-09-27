import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwtDecode from "jwt-decode"
import { DecodedToken, Post, User } from "@/types"
import { getCurrentAccessToken } from "@/api/config"
import { Comment } from "@/types"

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export const formatRelativeDate = (date: Date) => {
    const now = new Date()
    const diff = +now - +new Date(date)

    if (diff < 1000) {
        return "just now"
    } else if (diff < 60 * 1000) {
        const seconds = Math.floor(diff / 1000)
        return `${seconds} seconds ago`
    } else if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000))
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else if (diff < 30 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days} ${days === 1 ? "day" : "days"} ago`
    } else {
        return new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(new Date(date))
    }
}

export const formatCurrency = (number: number): string => {
    const formatter = new Intl.NumberFormat(undefined, {
        currency: "USD",
        style: "currency",
    })

    return formatter.format(number)
}

export const formatNumber = (number: number): string => {
    const formatter = new Intl.NumberFormat(undefined)

    return formatter.format(number)
}

export const inputClassName = `border bg-primary-800 
    rounded-md py-2 px-3 text-white focus:outline-none`

export const labelClassName = `inline-block text-neutral-500`

export const pageSpinnerClassName =
    "absolute left-[50%] inset-0 mx-auto top-[40%] w-[40px] h-[40px]"

export const getRandomNumberRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const safeError = (error: unknown) =>
    error && error instanceof Error ? error.message : ""

export const optimisticallyUpdatedConnections = (data: Comment) => {
    const accessToken = getCurrentAccessToken()

    if (accessToken) {
        const user: DecodedToken = jwtDecode(accessToken)

        const connected = data.user.connections.includes(user._id)

        const updatedConnections = connected
            ? data.user.connections.filter(
                  (userConnection) => userConnection !== user._id
              )
            : [...data.user.connections, user._id]

        return updatedConnections
    }
}

export const optimisticallyUpdatedLikes = (data: Post) => {
    const accessToken = getCurrentAccessToken()

    if (accessToken) {
        const user: DecodedToken = jwtDecode(accessToken)

        const liked = data.likes.includes(user._id)

        const updatedLikes = liked
            ? data.likes.filter((userLike) => userLike !== user._id)
            : [...data.likes, user._id]

        return updatedLikes
    }
}

export const guestUser: User = {
    _id: "guest",
    fullName: "Guest",
    username: "guest",
    profileImageUrl: `https://api.dicebear.com/6.x/micah/svg?seed=guest`,
    email: "",
    connections: [],
    password: "",
    profileViews: 0,
}
