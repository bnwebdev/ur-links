import { DependencyList, EffectCallback, useEffect, useRef } from "react"

export const useInitializedEffect = (effect: EffectCallback, deps?: DependencyList) => {
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else {
            return effect()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}