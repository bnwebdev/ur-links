import { useCallback, useState } from "react";
import { AppDexie } from "../AppDexie";
import { getDatabase } from "../instace";

type Callback<T, Args extends any[]> = (db: AppDexie, ...args: Args) => Promise<T>
type Result<T, Args extends any[]> = [(...args: Args) => Promise<T>, T | undefined]

export const useLazyDexie = <T, Args extends any[]>(callback: Callback<T, Args>, defaultValue?: T): Result<T, Args> => {
    const [result, setResult] = useState<T>();
    const db = getDatabase()
    
    const wrappedCallback = useCallback(async (...args: Args) => {
        const resultFromFn = await callback(db, ...args);
        const _result = defaultValue ? resultFromFn || defaultValue: resultFromFn
        setResult(_result);

        return _result;
    }, [callback, db, defaultValue])
    
    return [wrappedCallback, result]
}