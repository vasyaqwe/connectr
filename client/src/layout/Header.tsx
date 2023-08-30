import { Avatar } from "@/components/ui/Avatar"
import { DropdownMenu, DropdownMenuOptions } from "@/components/ui/DropdownMenu"
import { LogoLink } from "@/components/LogoLink"
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
        <header className="sticky top-0 z-10 bg-neutral-100 py-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <LogoLink />
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <Link to={`/users/${user._id}`}>
                                <Avatar
                                    src={user.profileImageUrl ?? ""}
                                    alt={"Profile image"}
                                />
                            </Link>

                            <DropdownMenu
                                variant="dark"
                                options={dropdownMenuOptions}
                            />
                        </>
                    ) : (
                        <>
                            <Link
                                to={"/signup"}
                                className="navigation-link"
                            >
                                Sign up
                            </Link>
                            <Link
                                to={"/login"}
                                className="navigation-link navigation-link--inverted"
                            >
                                Log in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
