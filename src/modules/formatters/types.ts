import { DocumentType } from "../document-types/types"

export type Condition = {}

export type Format = {}

export type Rule = {
    priority?: number
    condition: Condition
    format: Format
}

export interface Formatter {
    id?: number;
    type: DocumentType['id'];
    rules: Rule[];
}