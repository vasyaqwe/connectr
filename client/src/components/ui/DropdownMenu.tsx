import { ReactElement, useEffect, useRef, useState } from "react"
import threeDots from "@/assets/three-dots.svg"
import { Spinner } from "./Spinner"

const variantLookup = {
    light: "hover:bg-neutral-50 focus:bg-neutral-50",
    dark: "hover:bg-neutral-450 focus:bg-neutral-450",
}

export type DropdownMenuOptions = {
    component: ReactElement
    onClick: () => void
    isLoading?: boolean
}[]

type DropdownMenuProps = {
    alignTo?: "left" | "right"
    variant?: keyof typeof variantLookup
    options: DropdownMenuOptions
}

export const DropdownMenu = ({
    alignTo = "right",
    variant = "light",
    options,
}: DropdownMenuProps) => {
    const [open, setOpen] = useState(false)
    const [highlightedIdx, setHighlightedIdx] = useState<number | undefined>(
        undefined
    )

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = ref.current

        const handler = (e: KeyboardEvent) => {
            if (e.target != container) return

            e.preventDefault()
            switch (e.code) {
                case "Enter":
                case "Space":
                    if (!open) {
                        setOpen(true)
                    }
                    if (highlightedIdx !== undefined) {
                        options[highlightedIdx]?.onClick()
                    }
                    if (open) setHighlightedIdx(undefined)
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!open) {
                        setOpen(true)
                        break
                    }
                    const newValue = !highlightedIdx
                        ? 0
                        : highlightedIdx + (e.code === "ArrowDown" ? 1 : -1)

                    if (newValue >= 0 && newValue < options.length) {
                        e.preventDefault()
                        setHighlightedIdx(newValue)
                    }
                    break
                }
                case "Escape":
                    setOpen(false)
                    setHighlightedIdx(undefined)
                    break
            }
        }

        container?.addEventListener("keydown", handler)

        return () => {
            container?.removeEventListener("keydown", handler)
        }
    }, [open, highlightedIdx, options.length])

    useEffect(() => {
        if (!options.some((o) => o.isLoading)) {
            setOpen(false)
        }
    }, [options])

    return (
        <div
            tabIndex={0}
            ref={ref}
            onBlur={(e) => {
                if (
                    ref.current &&
                    !ref.current.contains(e.relatedTarget as Node)
                ) {
                    setOpen(false)
                    setHighlightedIdx(undefined)
                }
            }}
            className={`relative grid h-8
            w-8 cursor-default place-items-center
                 rounded-md transition-colors
                 focus:outline-none ${variantLookup[variant]} `}
            aria-expanded={open}
            onClick={(e) => {
                e.stopPropagation()
                if (!open) setOpen(true)
            }}
        >
            <img
                src={threeDots}
                alt="three dots"
            />
            <div
                role="menu"
                className={`absolute min-w-[9rem] transition-all ${
                    open
                        ? "pointer-events-auto scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                } top-[110%] rounded-md ${
                    alignTo === "left" ? "left-0" : "right-0"
                }
                         border border-neutral-500 bg-white p-1`}
            >
                {options.map((o, idx) => (
                    <button
                        onClick={o.onClick}
                        key={idx}
                        disabled={o.isLoading}
                        role="menuitem"
                        className={`flex w-full cursor-default items-center justify-between px-2 py-1 focus:bg-neutral-450 focus:outline-none
            disabled:opacity-60 ${
                highlightedIdx === idx ? "bg-neutral-450" : ""
            }
            gap-2 rounded-[.3rem] transition-colors hover:bg-neutral-450`}
                    >
                        {o.component}
                        {o.isLoading && (
                            <Spinner
                                className="h-4 w-4"
                                variant="neutral"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
