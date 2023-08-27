import { Link, useLocation } from "react-router-dom"
import logo from "@/assets/logo.svg"

export const LogoLink = () => {
    const { pathname } = useLocation()

    const isOnAuthPage =
        pathname.includes("signup") || pathname.includes("login")

    return (
        <Link
            className="flex items-center gap-3 rounded-md focus-visible:outline outline-2 outline-accent-300"
            to={"/"}
        >
            <img
                src={logo}
                alt="Connectr"
            />
            {!isOnAuthPage && (
                <p className="text-3xl font-semibold gradient-text">Connectr</p>
            )}
        </Link>
    )
}
