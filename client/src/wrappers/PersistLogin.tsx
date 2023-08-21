import { useQuery, useQueryClient } from "@tanstack/react-query"
import { refresh } from "@/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"
import { Outlet } from "react-router-dom"
import { useEffect, useRef } from "react"
import { Spinner } from "@/components/ui/Spinner"
import { pageSpinnerClassName } from "@/lib/utils"

export const PersistLogin = () => {
    const queryClient = useQueryClient()
    const { setToken, token, persist } = useAuthStore()

    const effectRan = useRef(false)

    const { isLoading } = useQuery(["auth"], () => refresh(), {
        onSuccess: (res) => {
            queryClient.invalidateQueries(["auth"])
            if (!token && persist) {
                setToken(res.accessToken)
                effectRan.current = true
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !effectRan.current,
    })

    useEffect(() => {
        if (!effectRan.current && !isLoading) {
            effectRan.current = true
        }
    }, [isLoading])

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
