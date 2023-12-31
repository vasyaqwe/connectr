import { useGoogleLogin } from "@react-oauth/google"
import { useLocation, useNavigate } from "react-router-dom"
import { googleLogin } from "@/api/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/useAuthStore"
import { useErrorToast } from "@/hooks/useErrorToast"
import google from "@/assets/google.svg"
import { useStore } from "@/stores/useStore"

export const GoogleLoginButton = () => {
    const { openToast } = useStore()
    const { setToken } = useAuthStore()

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { error, mutate: onSubmit } = useMutation(
        (code: string) => googleLogin(code),
        {
            onSuccess: ({ accessToken }) => {
                queryClient.invalidateQueries(["auth"])
                setToken(accessToken)
                navigate("/")
                openToast({ text: "Welcome!" })
            },
        }
    )
    useErrorToast(error)

    const login = useGoogleLogin({
        onSuccess: (res) => {
            onSubmit(res.code)
        },
        flow: "auth-code",
    })

    return (
        <button
            type="button"
            className="focus flex items-center justify-center gap-[24px] rounded-md border
            border-transparent bg-white px-[8px] py-2 font-medium text-neutral-900 shadow-md transition-shadow hover:shadow-sm"
            onClick={() => login()}
        >
            <img
                className="max-w-[1.5rem]"
                src={google}
                alt="Google"
            />
            {pathname.includes("signup") ? "Sign up" : "Log in"} with Google
        </button>
    )
}
