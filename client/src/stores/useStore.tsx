import { create } from "zustand"
import { devtools } from "zustand/middleware"

type ToastPayload = {
    text: string
    error?: boolean
    alert?: boolean
}
type Toast = {
    open: boolean
    text: string
    error?: boolean
    alert?: boolean
} & ToastPayload

const dialogs = {
    createAccount: false,
}

type Dialog = keyof typeof dialogs
type StoreState = {
    dialogs: typeof dialogs
    toast: Toast
    onBackdropClick: () => void
    showDialog: (dialog: Dialog) => void
    closeDialog: (dialog: Dialog) => void
    openToast: (payload: ToastPayload) => void
    closeToast: () => void
}

export const useStore = create<StoreState>()(
    devtools((set, get) => ({
        dialogs,
        onBackdropClick: () => {
            const target = Object.keys(get().dialogs).find(
                (v) => get().dialogs[v as keyof typeof dialogs]
            )
            if (target)
                set((state) => ({
                    dialogs: { ...state.dialogs, [target]: false },
                }))
        },
        toast: { open: false, text: "", error: false, alert: false },
        openToast: ({ text, error = false, alert = false }: ToastPayload) =>
            set(() => ({
                toast: {
                    open: true,
                    text,
                    error,
                    alert,
                },
            })),
        closeToast: () =>
            set((state) => ({ toast: { ...state.toast, open: false } })),
        showDialog: (dialog) =>
            set((state) => ({ dialogs: { ...state.dialogs, [dialog]: true } })),
        closeDialog: (dialog) =>
            set((state) => ({
                dialogs: { ...state.dialogs, [dialog]: false },
            })),
    }))
)
