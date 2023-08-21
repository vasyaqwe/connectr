import { AnimatePresence, motion } from "framer-motion"
import { ReactElement, ReactNode } from "react"

type DialogProps = {
    children: ReactNode
    open: boolean
    trigger: ReactElement
}

export const Dialog = ({ children, open, trigger }: DialogProps) => {
    return (
        <>
            {trigger}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="modal-backdrop"
                        />
                        <motion.dialog
                            open
                            className="bg-primary-700 inset-0 m-auto p-12 w-full max-w-lg modal"
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-white text-4xl font-bold mb-4">
                                Confirm deletion
                            </h2>
                            {children}
                        </motion.dialog>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
