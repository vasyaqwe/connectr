import { ChangeEvent, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useFormValidation } from "@/hooks/useFormValidation"
import { checkEmail, checkUsername, createUser } from "@/api/users"
import { useStore } from "@/stores/useStore"
import { EmailStep } from "./EmailStep"
import logo from "@/assets/logo.svg"
import { UsernameStep } from "./UsernameStep"
import { PasswordStep } from "./PasswordStep"
import useMeasure from "react-use-measure"
import { AnimatePresence, motion } from "framer-motion"
import { InfoStep } from "./InfoStep"
import { useAuthStore } from "@/stores/useAuthStore"
import { signUpSchema } from "@/lib/validations/signUp"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"

export const SignUp = () => {
    const { openToast } = useStore()
    const { setToken } = useAuthStore()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        location: "",
        bio: "",
        confirmPassword: "",
    })

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const formRef = useRef<HTMLFormElement>(null)
    const [ref, { height }] = useMeasure()

    const {
        isLoading,
        error,
        mutate: onSubmit,
    } = useMutation(
        () =>
            createUser({
                fullName: formData.fullName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                location:
                    formData.location.length > 0
                        ? formData.location
                        : undefined,
                bio: formData.bio.length > 0 ? formData.bio : undefined,
            }),
        {
            onSuccess: ({ accessToken }) => {
                queryClient.invalidateQueries(["auth"])
                setToken(accessToken)
                navigate("/")
                openToast({ text: "Welcome!" })
            },
        }
    )

    const {
        isLoading: checkEmailLoading,
        error: checkEmailError,
        mutate: onCheckEmail,
    } = useMutation(() => checkEmail({ email: formData.email }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["auth"])
            onNext()
        },
    })

    const {
        isLoading: checkUsernameLoading,
        error: checkUsernameError,
        mutate: onCheckUsername,
    } = useMutation(() => checkUsername({ username: formData.username }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["auth"])
            onNext()
        },
    })

    const steps = [
        {
            name: "emailStep" as const,
            requiredFields: ["email"],
            isLoading: checkEmailLoading,
            onSubmit: onCheckEmail,
            component: EmailStep,
        },
        {
            name: "usernameStep" as const,
            requiredFields: ["username"],
            isLoading: checkUsernameLoading,
            onSubmit: onCheckUsername,
            component: UsernameStep,
        },
        {
            name: "infoStep" as const,
            requiredFields: ["fullName", "bio"],
            component: InfoStep,
        },
        {
            name: "passwordStep" as const,
            requiredFields: ["password", "confirmPassword"],
            onSubmit,
            isLoading,
            component: PasswordStep,
        },
    ].map((s, idx) => ({ ...s, idx }))

    type StepName = (typeof steps)[number]["name"]

    const { onNext, currentStep, onBack } = useMultiStepForm<StepName>(steps)

    const { safeOnSubmit, errors } = useFormValidation({
        onSubmit: steps[currentStep.idx]?.onSubmit ?? onNext,
        formData,
        zodSchema: signUpSchema,
        currentStep,
    })

    useErrorToast(error)
    useErrorToast(checkEmailError)
    useErrorToast(checkUsernameError)

    return (
        <div className="min-h-screen px-4 pt-16 md:pt-28 ">
            <div className="flex items-center justify-center gap-4 mb-8">
                <img
                    src={logo}
                    alt="Connectr"
                />
                <h1 className="text-5xl font-semibold text-center gradient-text">
                    Connectr
                </h1>
            </div>
            <h2 className="text-3xl font-semibold text-center sm:text-4xl">
                Create an account
            </h2>
            <div className="mt-10 overflow-hidden card">
                <motion.form
                    className="flex flex-col gap-4"
                    animate={{ height: height }}
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault()
                        safeOnSubmit()
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.idx}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            ref={ref}
                            className="flex flex-col gap-5 "
                        >
                            <div className="flex flex-col gap-2">
                                {steps[currentStep.idx]?.component({
                                    isLoading:
                                        steps[currentStep.idx]?.isLoading,
                                    onBack: onBack,
                                    onChange: onChange,
                                    formData: formData,
                                    errors: errors,
                                })}
                            </div>

                            <p className="text-center text-neutral-800">
                                Already registered?{" "}
                                <Link
                                    className="link"
                                    to={"/login"}
                                >
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </motion.form>
            </div>
        </div>
    )
}
