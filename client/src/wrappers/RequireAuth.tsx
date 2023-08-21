import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

export const RequireAuth = () => {
    const { token } = useAuthStore()

    const location = useLocation()

    const allowed = token !== null

    const content = allowed ? (
        <Outlet />
    ) : (
        <Navigate
            to="/login"
            state={{ from: location }}
            replace={true}
        />
    )

    return content
}
