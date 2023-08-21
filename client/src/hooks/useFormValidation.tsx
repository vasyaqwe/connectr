import { MultiStepFormStep } from "@/types"
import { useEffect, useState } from "react"
import { ZodIssueBase } from "zod"
import * as z from "zod"

export type ValidationErrors = Record<string, string>

export const useFormValidation = <TFormData,>({
    onSubmit,
    formData,
    zodSchema,
    currentStep,
}: {
    onSubmit: () => void
    formData: TFormData
    zodSchema: z.Schema<TFormData>
    currentStep?: MultiStepFormStep
}) => {
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [showErrors, setShowErrors] = useState(false)

    useEffect(() => {
        if (currentStep?.idx !== undefined) setShowErrors(false)
    }, [currentStep?.idx])

    const getFormDataKey = (e: ZodIssueBase) => {
        let inputId = ""
        if (e.path && e.path.length > 0) {
            if (e.path.length === 2) {
                inputId = e.path.join(":") // if key is nested one level deep
            } else if (e.path.length === 3) {
                inputId = e.path.slice(1, e.path.length).reverse().join("") // if key is an array of objects
            } else {
                inputId = typeof e.path[0] === "string" ? e.path[0] : ""
            }
        }
        return inputId
    }

    const validate = () => {
        const res = zodSchema.safeParse(formData)
        if (!res.success) {
            const errorsArr = JSON.parse(res.error.message)

            const errorsObject = errorsArr.reduce(
                (result: Record<string, string>, e: ZodIssueBase) => {
                    const key = getFormDataKey(e)
                    const message = e.message
                    if (message) {
                        result[key] = message
                    }
                    return result
                },
                {}
            )
            setErrors(errorsObject)
        } else {
            setErrors({})
        }
    }

    useEffect(validate, [formData, zodSchema])

    const safeOnSubmit = () => {
        const noErrors = Object.keys(errors).length < 1

        if (currentStep) {
            const noErrorsOnCurrentStep = !Object.keys(errors).some((e) =>
                currentStep.requiredFields.includes(e)
            )
            if (noErrorsOnCurrentStep) {
                setShowErrors(false)
                onSubmit()
            } else {
                setShowErrors(true)
            }
        } else {
            if (noErrors) {
                setShowErrors(false)
                onSubmit()
            } else {
                setShowErrors(true)
            }
        }
    }

    return {
        errors: showErrors ? errors : {},
        safeOnSubmit,
    }
}
