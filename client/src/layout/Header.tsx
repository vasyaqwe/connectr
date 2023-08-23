import { Avatar } from "@/components/ui/Avatar"
import { DropdownMenu, DropdownMenuOptions } from "@/components/ui/DropdownMenu"
import { Logo } from "@/components/Logo"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useAuthStore } from "@/stores/useAuthStore"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "@/api/auth"
import doorArrow from "@/assets/doorArrow.svg"
import { useAuth } from "@/hooks/useAuth"

export const Header = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const user = useAuth()
    const { setToken } = useAuthStore()

    const {
        isLoading,
        error,
        mutate: onLogout,
    } = useMutation(logout, {
        onSuccess: () => {
            queryClient.invalidateQueries(["auth"])
            navigate("/login")
            setToken(null)
        },
    })

    useErrorToast(error)

    const dropdownMenuOptions: DropdownMenuOptions = [
        {
            component: (
                <span className="flex items-center gap-2">
                    <img
                        src={doorArrow}
                        alt="Log out"
                    />
                    Log out
                </span>
            ),
            isLoading,
            onClick: () => onLogout(),
        },
    ]

    return (
        <header className="py-4 shadow-md bg-neutral-100">
            <div className="container flex items-center justify-between mx-auto">
                <Logo />
                <div className="flex items-center gap-2">
                    <Link to={`/users/${user?._id}`}>
                        <Avatar
                            src={user?.profileImageUrl ?? ""}
                            alt={"Profile image"}
                        />
                    </Link>

                    <DropdownMenu
                        variant="dark"
                        options={dropdownMenuOptions}
                    />
                </div>
            </div>
        </header>
    )
}
