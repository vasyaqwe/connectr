import { Link, Outlet } from "react-router-dom"
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
                <p className="fixed p-2 text-sm -translate-x-1/2 rounded-md bg-primary-800 bottom-4 left-1/2">
                    Created by{" "}
                    <Link
                        className="link"
                        target="_blank"
                        to={
                            "https://www.upwork.com/freelancers/~015c1b113a62e11b13"
                        }
                    >
                        Vasyl P
                    </Link>
                    . Source code available on{" "}
                    <Link
                        target="_blank"
                        className="link"
                        to="https://github.com/vasyaqwe/connectr"
                    >
                        GitHub
                    </Link>
                </p>
                <Toast />
                <Outlet />
            </main>
        </>
    )
}
