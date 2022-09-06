import { useMemo } from "react"
import { useTranslate } from "./useTranslate"

export const useSupportedLocales = () => {
    const i18n = useTranslate()
    
    return useMemo(
        () => Object.keys(i18n.translations), 
        [i18n],
    )
}