import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useFormValidation } from "@/hooks/useFormValidation"
import { Button } from "@/components/ui/Button"
import logo from "@/assets/logo.svg"
import { login } from "@/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"
import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton"
import { authSchema } from "@/lib/validations/auth"

export const Login = () => {
    const queryClient = useQueryClient()
    const { setToken, setPersist, persist } = useAuthStore()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate()

    const {
        isLoading,
        error,
        mutate: onSubmit,
    } = useMutation(() => login(formData), {
        onSuccess: ({ accessToken }) => {
            queryClient.invalidateQueries(["auth"])
            setToken(accessToken)
            navigate("/")
        },
    })

    const { safeOnSubmit, errors } = useFormValidation({
        formData,
        zodSchema: authSchema,
        onSubmit,
    })

    useErrorToast(error)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="px-4 pt-20 md:pt-36">
            <div className="mb-8 flex items-center justify-center gap-4">
                <img
                    src={logo}
                    alt="Connectr "
                />
                <h1 className="gradient-text text-center text-5xl font-semibold">
                    Connectr
                </h1>
            </div>
            <h2 className="text-center text-3xl font-semibold sm:text-4xl">
                Welcome back.
            </h2>
            <div className="card mt-10">
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        safeOnSubmit()
                    }}
                >
                    <div>
                        <label
                            className="mb-[2px] inline-block font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <Input
                            autoFocus
                            invalid={errors.email}
                            placeholder="example@example.com"
                            value={formData.email}
                            onChange={onChange}
                            id="email"
                            name="email"
                            type="text"
                        />
                        <label
                            className="mb-[2px] mt-3 inline-block font-medium"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <Input
                            invalid={errors.password}
                            placeholder="Your password"
                            value={formData.password}
                            onChange={onChange}
                            id="password"
                            name="password"
                            type="password"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            disabled={isLoading}
                            isLoading={isLoading}
                            className={`justify-center`}
                        >
                            Log in
                        </Button>
                        <GoogleLoginButton />
                    </div>
                    <Checkbox
                        className="justify-center"
                        onChange={(value) => setPersist(value)}
                        id="persist-login"
                        checked={persist}
                        label={"Remember me"}
                    />
                    <p className="text-center text-neutral-800">
                        Don't have an account yet?{" "}
                        <Link
                            className="link"
                            to={"/signup"}
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
