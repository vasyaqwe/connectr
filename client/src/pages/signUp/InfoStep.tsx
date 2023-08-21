import { SignUpStepProps } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export const InfoStep = ({
    errors,
    formData,
    onChange,
    onBack,
}: SignUpStepProps) => {
    return (
        <>
            <div>
                <label
                    className="label"
                    htmlFor="fullName"
                >
                    Full name
                </label>
                <Input
                    autoFocus
                    invalid={errors.fullName}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={onChange}
                    id="fullName"
                    name="fullName"
                    type="text"
                />
            </div>
            <div>
                <label
                    className="label"
                    htmlFor="fullName"
                >
                    About yourself (optional)
                </label>
                <Input
                    invalid={errors.bio}
                    placeholder="Your bio"
                    value={formData.bio}
                    onChange={onChange}
                    id="bio"
                    name="bio"
                    type="text"
                />
            </div>
            <div>
                <label
                    className="label"
                    htmlFor="location"
                >
                    Your location (optional)
                </label>
                <Input
                    placeholder="e.g. Ukraine"
                    value={formData.location}
                    onChange={onChange}
                    id="location"
                    name="location"
                    type="text"
                />
            </div>
            <div className="flex flex-col gap-3 mt-3 items-center">
                <Button
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
