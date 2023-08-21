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
            className={`py-3 px-6 rounded-md w-[min(90%,500px)] text-center sm:w-fit mx-auto z-[99] fixed left-1/2 -translate-x-1/2 top-5 -translate-y-[300%] border ${
                toast.open ? "translate-y-0" : ""
            }
        transition-all
        ${toast.alert ? "alert" : ""} ${
                toast.error
                    ? "bg-danger-50 border-danger-400"
                    : "bg-accent-100 border-accent-400"
            }`}
        >
            {toast.text}
        </p>
    )
}
