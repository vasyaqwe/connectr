import { Link } from "react-router-dom"
import logo from "@/assets/logo.svg"

export const Logo = () => {
    return (
        <Link
            className="inline-block rounded-md focus:outline-none focus-visible:outline-accent-300"
            to={"/"}
        >
            <img
                src={logo}
                alt="Connectr"
            />
        </Link>
    )
}
