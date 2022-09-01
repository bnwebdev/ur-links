import { Table } from "dexie";
import { Document } from "../documents";
import { DocumentType } from '../document-types';

export interface AppDatabase {
    documents: Table<Document>;
    documentTypes: Table<DocumentType>;
}

export type StoresDescription = Record<keyof AppDatabase, string>