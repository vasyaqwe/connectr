import { useStore } from "@/stores/useStore"
import { motion } from "framer-motion"
import { ReactElement, ReactNode } from "react"

type DialogProps = {
    children: ReactNode
    open: boolean
    title: string
    header?: ReactElement
}

export const Dialog = ({ title, header, children, open }: DialogProps) => {
    const { onBackdropClick } = useStore()

    return (
        open && (
            <>
                <motion.div
                    onClick={onBackdropClick}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    className="modal-backdrop"
                />
                <motion.dialog
                    open
                    className="fixed inset-0 z-[99] m-auto w-[90%] max-w-lg rounded-md border border-accent-300 p-10"
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ ease: "easeInOut", duration: 0.25 }}
                >
                    {header && header}
                    <h2 className="mb-4 mt-5 text-center text-2xl font-semibold">
                        {title}
                    </h2>
                    {children}
                </motion.dialog>
            </>
        )
    )
}
