import { DocumentType } from "../document-types/types"

type AstTreeWithFormatFunction = string

export interface Formatter {
    id?: number;
    type: DocumentType['id'];
    rules: AstTreeWithFormatFunction;
}