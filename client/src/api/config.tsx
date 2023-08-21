import axios, { AxiosResponse } from "axios"

export const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "https://invoices-ga5s.onrender.com"

import { useAuthStore } from "@/stores/useAuthStore"
import { refresh } from "./auth"

export const getCurrentAccessToken = () => useAuthStore.getState().token

export const defaultAxios = axios.create({ baseURL: API_URL })

export const axiosRequest = async <T,>(
    requestFunction: () => Promise<AxiosResponse<T>>
): Promise<T> => {
    try {
        const res = await requestFunction()
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
})

axiosPrivate.interceptors.request.use(
    (config) => {
        if (!config.headers["Authorization"]) {
            config.headers[
                "Authorization"
            ] = `Bearer ${getCurrentAccessToken()}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevReq = error?.config

        if (error?.response?.status === 403 && !prevReq?.sent) {
            prevReq.sent = true

            try {
                const refreshedRes = await refresh()
                prevReq.headers[
                    "Authorization"
                ] = `Bearer ${refreshedRes.accessToken}`

                return axiosPrivate(prevReq)
            } catch (e) {
                const errorMessage =
                    "Your session has expired. Please <a href='/login' class='link underline'>log in</a> again."
                error.response.data = { message: errorMessage }
            }
        }

        return Promise.reject(error)
    }
)
