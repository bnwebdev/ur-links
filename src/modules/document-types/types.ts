import { TypeDescription } from "../../RootFactory/types";

export interface DocumentType {
  id?: number;
  name: string;
  fieldTypes: Record<string, TypeDescription>
}