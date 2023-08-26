import { Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

export const RequireAuth = () => {
    const { token } = useAuthStore()

    const allowed = token !== null

    const content = allowed ? <Outlet /> : <Outlet />

    return content
}
