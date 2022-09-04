export interface Document {
  id?: number;
  title: string;
  authors: number[];
  meta: Record<string, any>;
}