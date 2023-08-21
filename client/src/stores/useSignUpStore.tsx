import { CurrentStep, UserFormData } from "@/types"
import { ChangeEvent } from "react"
import { create } from "zustand"

const initialFormData = {
    fullName: "",
    email: "",
    username: "",
    password: "",
    location: "",
    bio: "",
    confirmPassword: "",
}

export const steps = [
    {
        idx: 0,
        name: "emailStep" as const,
        requiredFields: ["email"],
    },
    {
        idx: 1,
        name: "usernameStep" as const,
        requiredFields: ["username"],
    },
    {
        idx: 2,
        name: "infoStep" as const,
        requiredFields: ["fullName"],
    },
    {
        idx: 3,
        name: "passwordStep" as const,
        requiredFields: ["password", "confirmPassword"],
    },
]

export type StepName = (typeof steps)[number]["name"]

export type SignUpStore = {
    currentStep: CurrentStep<StepName>
    onNext: () => void
    onBack: () => void
    goToStep: (stepName: StepName) => void
    isFirstStep: () => boolean
    isLastStep: () => boolean
    formData: UserFormData
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const useSignUpStore = create<SignUpStore>()((set, get) => ({
    currentStep: steps[0]!,
    onNext: () => {
        if (!get().isLastStep()) {
            const newIdx =
                get().currentStep.idx >= steps.length - 1
                    ? get().currentStep.idx
                    : get().currentStep.idx + 1

            set(() => ({
                currentStep: steps.find((s) => s.idx === newIdx),
            }))
        } else {
            const newIdx = steps.length - 1

            set(() => ({
                currentStep: steps.find((s) => s.idx === newIdx),
                formSubmitted: true,
            }))
        }
    },
    onBack: () => {
        set((state) => {
            const newIdx =
                state.currentStep.idx <= 0
                    ? state.currentStep.idx
                    : state.currentStep.idx - 1

            return {
                currentStep: steps.find((s) => s.idx === newIdx),
            }
        })
    },
    goToStep: (stepName) => {
        const newStep = steps.find((s) => s.name === stepName)
        if (newStep) {
            set(() => ({
                currentStep: steps.find((s) => s.name === stepName),
            }))
        }
    },
    isFirstStep: () => get().currentStep.idx === 0,
    isLastStep: () => get().currentStep.idx === steps.length - 1,
    formData: initialFormData,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        set((state) => ({
            formData: {
                ...state.formData,
                [name]: value,
            },
        }))
    },
}))
