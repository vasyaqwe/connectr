import { useEffect } from "react"
import { useStore } from "@/stores/useStore"

export const useErrorToast = (error: unknown) => {
    const { openToast } = useStore()

    useEffect(() => {
        if (error instanceof Error)
            openToast({ text: error.message, error: true })
    }, [error])
}
