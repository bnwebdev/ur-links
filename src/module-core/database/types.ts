import { Table } from "dexie";
import { Document } from "../../modules/documents";
import { DocumentType } from '../../modules/document-types';

export interface AppDatabase {
    documents: Table<Document>;
    documentTypes: Table<DocumentType>;
}

export type StoresDescription = Record<keyof AppDatabase, string>