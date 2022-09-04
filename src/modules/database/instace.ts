import { AppDexie } from "./AppDexie"

let db: AppDexie | null

export const getMaybeDatabase = (): AppDexie | null => db

export const getDatabase = (): AppDexie => {
    if (db === null) {
        throw new Error('Database hasn`t already been created')
    }

    return db
}

export const useDatabaseInstance = (instance: AppDexie): void => { db = instance }