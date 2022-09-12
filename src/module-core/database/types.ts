import { Table } from "dexie";
import { Document } from "../../modules/documents";
import { DocumentType } from '../../modules/document-types';
import { Formatter } from "../../modules/formatters/types";

export interface AppDatabase {
    documents: Table<Document>;
    documentTypes: Table<DocumentType>;
    formatters: Table<Formatter>;
}

export type StoresDescription = Record<keyof AppDatabase, string>