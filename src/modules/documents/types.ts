import { DocumentType } from "../document-types/types";

export interface Document {
  id?: number;
  type: DocumentType['id'];
  meta: Record<string, any>;
}