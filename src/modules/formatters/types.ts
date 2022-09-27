import { DocumentType } from "../document-types/types"

type FormatterCode = string

export interface Formatter {
    id?: number;
    type: DocumentType['id'];
    code: FormatterCode;
    name: string;
}