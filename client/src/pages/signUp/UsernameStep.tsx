import { SignUpStepProps } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export const UsernameStep = ({
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
                    htmlFor="username"
                >
                    Choose a username
                </label>
                <Input
                    autoFocus
                    invalid={errors.username}
                    placeholder="exampleusername"
                    value={formData.username}
                    onChange={onChange}
                    id="username"
                    name="username"
                    type="text"
                />
            </div>
            <div className="flex flex-col items-center gap-3 mt-3">
                <Button
                    isLoading={isLoading}
                    disabled={isLoading}
                    className={`justify-center w-full`}
                    arrow={"next"}
                >
                    Next
                </Button>
                <Button
                    type="button"
                    onClick={onBack}
                    className={`justify-center w-full`}
                    arrow={"back"}
                >
                    Back
                </Button>
            </div>
        </>
    )
}
