import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useFormValidation } from "@/hooks/useFormValidation"
import { checkEmail, checkUsername, createUser } from "@/api/users"
import { useStore } from "@/stores/useStore"
import { EmailStep } from "./EmailStep"
import logo from "@/assets/logo.svg"
import { UsernameStep } from "./UsernameStep"
import { StepName, useSignUpStore } from "@/stores/useSignUpStore"
import { PasswordStep } from "./PasswordStep"
import useMeasure from "react-use-measure"
import { AnimatePresence, motion } from "framer-motion"
import { InfoStep } from "./InfoStep"
import { useAuthStore } from "@/stores/useAuthStore"
import { signUpSchema } from "@/lib/validations/signUp"

export const SignUp = () => {
    const { openToast } = useStore()
    const { setToken } = useAuthStore()
    const { onNext, formData, currentStep } = useSignUpStore()

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
                location: formData.location,
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

    const onSubmitLookup: Record<StepName, () => void> = {
        emailStep: onCheckEmail,
        usernameStep: onCheckUsername,
        infoStep: onNext,
        passwordStep: onSubmit,
    }

    const { safeOnSubmit, errors } = useFormValidation({
        onSubmit: onSubmitLookup[currentStep.name],
        formData,
        zodSchema: signUpSchema,
        currentStep,
    })

    const steps = [
        <EmailStep
            isLoading={checkEmailLoading}
            errors={errors}
        />,
        <UsernameStep
            isLoading={checkUsernameLoading}
            errors={errors}
        />,
        <InfoStep errors={errors} />,
        <PasswordStep
            isLoading={isLoading}
            errors={errors}
        />,
    ]

    useErrorToast(error)
    useErrorToast(checkEmailError)
    useErrorToast(checkUsernameError)

    return (
        <div className="min-h-screen px-4 pt-16 md:pt-28 ">
            <div className="flex items-center justify-center mb-8 gap-4">
                <img
                    src={logo}
                    alt="Connectr"
                />
                <h1 className="text-5xl text-center gradient-text font-semibold">
                    Connectr
                </h1>
            </div>
            <h2 className="text-3xl sm:text-4xl text-center font-semibold">
                Create an account
            </h2>
            <div className="card mt-10 overflow-hidden">
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
                                {steps[currentStep.idx]}
                            </div>

                            <p className="text-neutral-800 text-center">
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
