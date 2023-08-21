import { Link } from "react-router-dom"
import logo from "@/assets/logo.svg"

export const Logo = () => {
    return (
        <Link
            className="focus:outline-none inline-block
                       focus-visible:outline-accent-300 rounded-md"
            to={"/"}
        >
            <img
                src={logo}
                alt="Connectr"
            />
        </Link>
    )
}
