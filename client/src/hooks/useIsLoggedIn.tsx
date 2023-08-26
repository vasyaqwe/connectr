import { getCurrentAccessToken } from "@/api/config"
import { useStore } from "@/stores/useStore"

export const useIsLoggedIn = () => {
    const { showDialog } = useStore()

    const isLoggedIn = (fn: () => void) => {
        if (getCurrentAccessToken() === null) {
            showDialog("createAccount")
        } else {
            fn()
        }
    }

    return { isLoggedIn }
}
