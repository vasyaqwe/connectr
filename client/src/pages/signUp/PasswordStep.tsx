import { SignUpStepProps } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export const PasswordStep = ({
    errors,
    isLoading,
    onChange,
    formData,
    onBack,
}: SignUpStepProps) => {
    return (
        <>
            <div>
                <label
                    className="label"
                    htmlFor="password"
                >
                    Password
                </label>
                <Input
                    autoFocus
                    invalid={errors.password}
                    placeholder="Choose a secure password"
                    value={formData.password}
                    onChange={onChange}
                    id="password"
                    name="password"
                    type="password"
                />
            </div>
            <div>
                <label
                    className="label"
                    htmlFor="confirmPassword"
                >
                    Repeat password
                </label>
                <Input
                    autoComplete="new-password"
                    invalid={errors.confirmPassword}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                />
            </div>
            <div className="mt-3 flex flex-col items-center gap-3">
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    className={`w-full  justify-center`}
                >
                    Sign up
                </Button>
                <Button
                    type="button"
                    onClick={onBack}
                    className={`w-full  justify-center`}
                    arrow={"back"}
                >
                    Back
                </Button>
            </div>
        </>
    )
}
