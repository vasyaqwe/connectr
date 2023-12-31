import { Link, Outlet, useLocation } from "react-router-dom"
import { useStore } from "@/stores/useStore"
import { Toast } from "@/components/ui/Toast"
import { useEffect } from "react"
import { Header } from "./Header"
import { CreateAccountDialog } from "@/components/dialogs/CreateAccountDialog"

export const Layout = () => {
    const { dialogs } = useStore()
    const { pathname } = useLocation()
    useEffect(() => {
        if (Object.values(dialogs).some((v) => v)) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [dialogs])

    const isOnAuthPage =
        pathname.includes("signup") || pathname.includes("login")

    return (
        <>
            {!isOnAuthPage && <Header />}
            <CreateAccountDialog />
            <main className="container mx-auto">
                <p className="fixed bottom-4 left-1/2 z-[40] w-max -translate-x-1/2 rounded-md border border-secondary-400 bg-secondary-100 p-2 text-center text-xs sm:text-sm">
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
