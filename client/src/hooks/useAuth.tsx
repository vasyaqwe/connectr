import { DecodedToken } from "@/types"
import { useAuthStore } from "@/stores/useAuthStore"
import jwtDecode from "jwt-decode"

export const useAuth = () => {
    const { token } = useAuthStore()

    if (token) {
        const user: DecodedToken = jwtDecode(token)

        return user
    }
}
