import { useState } from "react"

export const useMultiStepForm = (steps) => {
    const [currentStep, setCurrentStep] = useState(steps[0])

    const lastStep = currentStep.idx === steps.length - 1

    const onNext = () => {
        if (!lastStep) {
            const newIdx =
                currentStep.idx >= steps.length - 1
                    ? currentStep.idx
                    : currentStep.idx + 1

            setCurrentStep(steps.find((s) => s.idx === newIdx))
        }
    }

    const onBack = () => {
        const newIdx =
            currentStep.idx <= 0 ? currentStep.idx : currentStep.idx - 1

        setCurrentStep(steps.find((s) => s.idx === newIdx))
    }

    return { onNext, onBack, goToStep, currentStep }
}
