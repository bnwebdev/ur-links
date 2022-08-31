import { Table } from "dexie";
import { Document } from "../documents/types";

export interface AppDatabase {
    documents: Table<Document>
}

export type StoresDescription = Record<keyof AppDatabase, string>