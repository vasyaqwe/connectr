import { ComponentProps } from "react"

type ErrorMessageProps = ComponentProps<"p"> & {
    message: string
}

export const ErrorMessage = ({
    message,
    className,
    ...rest
}: ErrorMessageProps) => {
    return (
        <p
            {...rest}
            className={` rounded-md border border-danger-400 bg-danger-50 px-3 py-2 text-danger-400 ${className}`}
            dangerouslySetInnerHTML={{ __html: message }}
        ></p>
    )
}
