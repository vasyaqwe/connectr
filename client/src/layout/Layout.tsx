import { Outlet } from "react-router-dom"
import { useStore } from "@/stores/useStore"
import { Toast } from "@/components/ui/Toast"
import { useEffect } from "react"
import { Header } from "./Header"
import { useAuth } from "@/hooks/useAuth"

export const Layout = () => {
    const { modals } = useStore()
    const user = useAuth()

    useEffect(() => {
        if (Object.values(modals).some((v) => v)) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [modals])

    return (
        <>
            {user && <Header />}
            <main className="container mx-auto mt-8 sm:mt-12">
                <Toast />
                <Outlet />
            </main>
        </>
    )
}
