import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
        return `${minutes} minutes ago`
    } else if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        return `${hours} hours ago`
    } else if (diff < 30 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days} days ago`
    } else {
        return new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(date)
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
