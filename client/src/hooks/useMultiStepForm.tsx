import { MultiStepFormStep } from "@/types"
import { useState } from "react"

export const useMultiStepForm = <TStepName,>(
    steps: MultiStepFormStep<TStepName>[]
) => {
    const [currentStep, setCurrentStep] = useState(steps[0]!)

    const lastStep = currentStep.idx === steps.length - 1
    const firstStep = currentStep.idx === 0

    const onNext = () => {
        if (!lastStep) {
            const newIdx =
                currentStep.idx >= steps.length - 1
                    ? currentStep.idx
                    : currentStep.idx + 1

            const newStep = steps.find((s) => s.idx === newIdx)
            if (newStep) setCurrentStep(newStep)
        }
    }

    const onBack = () => {
        const newIdx =
            currentStep.idx <= 0 ? currentStep.idx : currentStep.idx - 1

        const newStep = steps.find((s) => s.idx === newIdx)
        if (newStep) setCurrentStep(newStep)
    }

    const goToStep = (stepName: TStepName) => {
        const newStep = steps.find((s) => s.name === stepName)
        if (newStep) setCurrentStep(newStep)
    }

    return { onNext, onBack, goToStep, currentStep, firstStep, lastStep }
}
