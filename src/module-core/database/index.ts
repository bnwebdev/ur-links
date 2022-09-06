import { Module } from "../module";

import { AppDexie } from "./AppDexie";
import { useDatabaseInstance } from "./instace";
import { StoresDescription } from "./types";

export * from './types'
export * from './hooks'

export default new Module({
    onAppCreate: [
        async (modules) => {
            useDatabaseInstance(new AppDexie(modules.storeDescription as StoresDescription || {}))
        }
    ]
})