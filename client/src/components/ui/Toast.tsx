import { useStore } from "@/stores/useStore"
import { useEffect } from "react"

export const Toast = () => {
    const { toast, closeToast } = useStore()

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (toast.open) closeToast()
        }, 4000)

        return () => clearTimeout(timeout)
    }, [toast.open])

    return (
        <p
            aria-hidden={!toast.open}
            className={`fixed left-1/2 top-5 z-[99] mx-auto w-[min(90%,500px)] -translate-x-1/2 -translate-y-[300%] rounded-md border px-6 py-3 text-center sm:w-fit ${
                toast.open ? "translate-y-0" : ""
            }
        transition-all
        ${toast.alert ? "alert" : ""} ${
            toast.error
                ? "border-danger-400 bg-danger-50"
                : "border-accent-400 bg-accent-100"
        }`}
        >
            {toast.text}
        </p>
    )
}
