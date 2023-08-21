import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"
import { useStore } from "@/stores/useStore"

export const ModalWrapper = ({
    children,
    open,
}: {
    children: ReactNode
    open: boolean
}) => {
    const { onBackdropClick } = useStore()

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                        onClick={onBackdropClick}
                    />
                    {children}
                </>
            )}
        </AnimatePresence>
    )
}
