import { FC, PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{
    error?: string
    custom?: boolean
}>

const ErrorPrinter: FC<Props> = ({ error, custom, children }) => {
    const template: ReactNode = custom 
        ? <>{children}</> 
        : <h3 className="text-danger">{error}</h3>

    return error ? <>{template}</> : null
}

export default ErrorPrinter