import { UserCredentials } from "@/types"
import { defaultAxios, axiosPrivate, axiosRequest } from "./config"

export const refresh = async () =>
    axiosRequest(() =>
        axiosPrivate.get(`/auth/refresh`, {
            withCredentials: true,
        })
    )

export const googleLogin = async (code: string) =>
    axiosRequest(() =>
        defaultAxios.post(
            `/auth/google-login`,
            { code },
            {
                withCredentials: true,
            }
        )
    )

export const login = async (credentials: UserCredentials) =>
    axiosRequest(() =>
        defaultAxios.post(`/auth`, credentials, {
            withCredentials: true,
        })
    )

export const logout = async () =>
    axiosRequest(() =>
        axiosPrivate.post(`/auth/logout`, {
            withCredentials: true,
        })
    )
