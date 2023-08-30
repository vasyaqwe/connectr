import { ComponentPropsWithRef, forwardRef } from "react"
import { Spinner } from "./Spinner"
import arrowIcon from "@/assets/arrowWhite.svg"
import { cn } from "@/lib/utils"

const variantLookup = {
    fill: "min-h-[42px] px-5 py-2 bg-accent-400 text-white hover:opacity-90 border border-transparent",
    link: "link border-none",
    outline:
        "min-h-[42px] px-5 py-2 bg-transparent text-neutral-900 border border-neutral-700 hover:bg-neutral-400",
    ghost: `focus-visible:bg-neutral-450 hover:bg-neutral-450 transition-colors rounded-md w-8 h-8
                 `,
    icon: ` border-neutral-600 bg-neutral-50
            focus-visible:bg-neutral-450 hover:bg-neutral-450 transition-colors rounded-md w-8 h-8 justify-center`,
    iconActive: ` border-neutral-600 bg-accent-400 border-accent-400
            focus-visible:opacity-80 hover:opacity-80 transition-opacity rounded-md w-8 h-8 justify-center`,
}

const spinnerLookup: { [key: string]: React.ReactElement } = {
    fill: <Spinner variant="inverse" />,
    outline: <Spinner variant="neutral" />,
}

type ButtonProps = ComponentPropsWithRef<"button"> & {
    isLoading?: boolean
    variant?: keyof typeof variantLookup
    arrow?: "back" | "next"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = "fill",
            isLoading = false,
            arrow,
            ...rest
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                {...rest}
                className={cn(
                    `focus group rounded-md border font-medium transition duration-100 ease-out
            ${variantLookup[variant]}
            ${arrow ? "min-w-[7rem]" : ""}
             disabled:opacity-70 
            ${
                isLoading ? "cursor-default opacity-80" : ""
            } flex items-center gap-2
            `,
                    className
                )}
            >
                {isLoading && spinnerLookup[variant]}
                <span className="relative flex h-[21px] items-center gap-2">
                    {arrow === "back" && (
                        <img
                            className="absolute -left-4 top-1/2 -translate-y-1/2 rotate-180 opacity-0 transition-all group-hover:-left-6 group-hover:opacity-100"
                            src={arrowIcon}
                            alt="arrow forwards"
                        />
                    )}
                    {children}
                    {arrow === "next" && (
                        <img
                            className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:-right-6 group-hover:opacity-100"
                            src={arrowIcon}
                            alt="arrow forwards"
                        />
                    )}
                </span>
            </button>
        )
    }
)
