import { useNavigate } from "react-router-dom"
import { Dialog } from "../ui/Dialog"
import logo from "@/assets/logo.svg"
import { useStore } from "@/stores/useStore"
import { Button } from "../ui/Button"

export const CreateAccountDialog = () => {
    const { dialogs, closeDialog } = useStore()
    const navigate = useNavigate()

    return (
        <Dialog
            header={
                <div className="flex items-center justify-center gap-3">
                    <img
                        src={logo}
                        alt="Connectr"
                    />
                    <p className="gradient-text text-5xl font-semibold">
                        Connectr
                    </p>
                </div>
            }
            title={"You need to be logged in."}
            open={dialogs.createAccount}
        >
            <p className="text-center text-lg font-medium">
                {" "}
                Create an account or log in now to start connecting.
            </p>
            <div className="mt-5 flex justify-center gap-4">
                <Button
                    role="link"
                    onClick={() => {
                        navigate("/signup")
                        closeDialog("createAccount")
                    }}
                >
                    Sign up
                </Button>
                <Button
                    role="link"
                    variant="outline"
                    onClick={() => {
                        navigate("/login")
                        closeDialog("createAccount")
                    }}
                >
                    Log in
                </Button>
            </div>
        </Dialog>
    )
}
