import { useEffect, useState } from "react";
import { getI18n } from "../instance";

export const useTranslate = () => {
    const [holderI18n, setHolderI18n] = useState({ i18n: getI18n() })

    useEffect(() => {
        const unsubscribe = holderI18n.i18n.onChange(
            () => setHolderI18n({ i18n: getI18n() }),
        )

        return unsubscribe;
    }, [holderI18n])

    return holderI18n.i18n
}