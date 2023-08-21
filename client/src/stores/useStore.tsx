import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface ToastPayload {
    text: string
    error?: boolean
    alert?: boolean
}
interface Toast extends ToastPayload {
    open: boolean
    text: string
    error?: boolean
    alert?: boolean
}

interface StoreState {
    modals: Record<string, boolean>
    toast: Toast
    onBackdropClick: () => void
    openModal: (modal: string) => void
    closeModal: (modal: string) => void
    openToast: (payload: ToastPayload) => void
    closeToast: () => void
}

export const useStore = create<StoreState>()(
    devtools((set, get) => ({
        modals: {
            createInvoice: false,
            confirmDeletion: false,
            editInvoice: false,
        },
        onBackdropClick: () => {
            const target = Object.keys(get().modals).find(
                (v) => get().modals[v]
            )
            if (target)
                set((state) => ({
                    modals: { ...state.modals, [target]: false },
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
        openModal: (modal) =>
            set((state) => ({ modals: { ...state.modals, [modal]: true } })),
        closeModal: (modal) =>
            set((state) => ({ modals: { ...state.modals, [modal]: false } })),
    }))
)
