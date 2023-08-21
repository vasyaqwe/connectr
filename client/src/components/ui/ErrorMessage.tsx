import { ComponentProps } from "react"

type ErrorMessageProps = ComponentProps<"p"> & {
    message: string
    className?: string
}

export const ErrorMessage = ({
    message,
    className,
    ...rest
}: ErrorMessageProps) => {
    return (
        <p
            {...rest}
            className={` bg-danger-50 border border-danger-400 text-danger-400 px-3 py-2 rounded-md ${className}`}
            dangerouslySetInnerHTML={{ __html: message }}
        ></p>
    )
}
