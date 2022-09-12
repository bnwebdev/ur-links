import { Table } from "dexie";
import { Document } from "../../modules/documents/types";
import { DocumentType } from '../../modules/document-types/types';
import { Formatter } from "../../modules/formatters/types";
import { WorkArea } from "../../modules/work-areas/types";

export interface AppDatabase {
    documents: Table<Document>;
    documentTypes: Table<DocumentType>;
    formatters: Table<Formatter>;
    workAreas: Table<WorkArea>;
}

export type StoresDescription = Record<keyof AppDatabase, string>