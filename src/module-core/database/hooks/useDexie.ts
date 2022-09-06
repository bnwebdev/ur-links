import { useLiveQuery } from "dexie-react-hooks"
import { AppDexie } from "../AppDexie"
import { getDatabase } from "../instace"

export const useDexie = <T>(callback: (db: AppDexie) => Promise<T>, deps: any[] = [], defaultResult?: T) => {
    const db = getDatabase()
    return useLiveQuery(() => callback(db), deps, defaultResult)
}