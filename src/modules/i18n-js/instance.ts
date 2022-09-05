import { Dict, I18n as I18nType } from "i18n-js/typings";
import { I18n } from 'i18n-js'

let i18n: I18nType | null = null;

export const initialize = (dict: Dict) => {
    i18n = new I18n(dict, { defaultLocale: 'en', missingBehavior: 'guess' })
    i18n.locale = localStorage.getItem('locale') || 'en'
    i18n.onChange(() => localStorage.setItem('locale', i18n?.locale || ''))
}

export const getMaybeI18n = (): I18nType | null => i18n;

export const getI18n = (): I18nType => {
    if (!i18n) {
        throw new Error(`I18n hasn't been made`)
    }

    return i18n;
}