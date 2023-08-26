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
                    className="w-full z-[99] max-w-lg border border-neutral-200 p-10 m-auto inset-0 rounded-md fixed"
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ ease: "easeInOut", duration: 0.25 }}
                >
                    {header && header}
                    <h2 className="mt-5 mb-4 text-2xl font-semibold text-center">
                        {title}
                    </h2>
                    {children}
                </motion.dialog>
            </>
        )
    )
}
