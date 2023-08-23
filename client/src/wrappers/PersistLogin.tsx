import { useQuery } from "@tanstack/react-query"
import { refresh } from "@/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"
import { Outlet } from "react-router-dom"
import { Spinner } from "@/components/ui/Spinner"
import { pageSpinnerClassName } from "@/lib/utils"

export const PersistLogin = () => {
    const { setToken, token, persist } = useAuthStore()

    const { isLoading } = useQuery(["auth"], () => refresh(), {
        onSuccess: (res) => {
            if (!token && persist) {
                setToken(res.accessToken)
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    })

    return (
        <>
            {!persist ? (
                <Outlet />
            ) : isLoading ? (
                <Spinner className={pageSpinnerClassName} />
            ) : (
                <Outlet />
            )}
        </>
    )
}
