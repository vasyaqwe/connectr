import { Link } from "react-router-dom"
import logo from "@/assets/logo.svg"

export const LogoLink = () => {
    return (
        <Link
            className="flex items-center gap-3 rounded-md outline-2 outline-accent-300 focus-visible:outline"
            to={"/"}
        >
            <img
                src={logo}
                alt="Connectr"
            />
            <p className="gradient-text text-3xl font-semibold">Connectr</p>
        </Link>
    )
}
