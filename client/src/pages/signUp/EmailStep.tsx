import { Button } from "@/components/ui/Button"
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton"
import { Input } from "@/components/ui/Input"
import { SignUpStepProps } from "@/types"

export const EmailStep = ({
    errors,
    isLoading,
    formData,
    onChange,
}: SignUpStepProps) => {
    return (
        <>
            <div>
                <label
                    className="label"
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
            </div>
            <div className="flex flex-col gap-3 mt-3">
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    className={`justify-center `}
                    arrow={"next"}
                >
                    Next
                </Button>
                <GoogleLoginButton />
            </div>
        </>
    )
}
