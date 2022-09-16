import { Table, Transaction } from "dexie";
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

export type DexieUpgradeFn = (trans: Transaction) => void | PromiseLike<any>

export type ObjectStoreMaker = {
    upgrade?: DexieUpgradeFn
    version?: number
    store: string
}

export type StoreMaker = string | ObjectStoreMaker | (ObjectStoreMaker | string)[]

export type StoresDescription = Record<keyof AppDatabase, StoreMaker>