import { DependencyList, EffectCallback, useEffect, useState } from "react"

export const useWithoutInitialEffect = (effect: EffectCallback, deps?: DependencyList | undefined, needReset?: boolean) => {
    const [isFirst, setIsFirst] = useState(true)

    useEffect(() => {
        if (isFirst) {
            setIsFirst(false)
        } else {
            return effect()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}