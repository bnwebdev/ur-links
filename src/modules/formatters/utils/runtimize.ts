import { Runtime } from "../../../interpreter/runtime"

export const runtimize = (value: string | null | undefined | number | boolean | Record<string, any>): Runtime => {
    if (!value) {
        return new Runtime.Null()
    }

    switch (typeof value) {
        case "boolean": return new Runtime.Boolean(value)
        case "object": return new Runtime.Object(
            Object.fromEntries(
                Object.entries(value).map(([key, v]) => [key, runtimize(v)])
            )
        )
        case "string": return new Runtime.String(value)
        case "number": return new Runtime.Number(value)
        default:
            throw new Error(`Mustn't be called`)
    }
}