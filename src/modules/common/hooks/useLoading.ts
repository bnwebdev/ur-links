import { Dispatch, SetStateAction, useCallback } from "react"

export const useLoading = <Cb extends (...args: any) => any>(fn: Cb, setLoading: Dispatch<SetStateAction<boolean>>) => {
    return useCallback(async (...args: Parameters<Cb>): Promise<ReturnType<Cb>> => {
        try {
            setLoading(true)
            return await fn(...args)
        } catch (e) {
            throw e
        } finally {
            setLoading(false)
        }
    }, [fn, setLoading])
}