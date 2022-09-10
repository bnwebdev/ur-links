import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useTranslate } from "./useTranslate"

export const useLocale = (): [string, Dispatch<SetStateAction<string>>] => {
    const i18n = useTranslate()
    const [locale, setLocale] = useState(i18n.locale || i18n.defaultLocale)
    
    useEffect(() => {
        i18n.locale = locale
    }, [locale, i18n])

    return [locale, setLocale];
}