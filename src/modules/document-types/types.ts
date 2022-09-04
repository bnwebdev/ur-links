export enum FieldType {
    NUMBER = 'number',
    STRING = 'string',
    ARRAY = 'array',
    OBJECT = 'object'
}

export interface BaseFieldDescription {
    type: FieldType
}

export interface StringFieldDescription extends BaseFieldDescription {
    type: FieldType.STRING
}

export interface NumberFieldDescription extends BaseFieldDescription {
    type: FieldType.NUMBER
}

export type ArrayFieldDescription = {
    type: FieldType.ARRAY
    itemType: FieldDescription
}

export type ObjectFieldDescription = {
    type: FieldType.OBJECT
    fieldTypes: Record<string, FieldDescription> 
}

export type FieldDescription =
  | StringFieldDescription
  | NumberFieldDescription
  | ArrayFieldDescription
  | ObjectFieldDescription;

export interface DocumentType {
  id?: number;
  name: string;
  fieldTypes: Record<string, FieldDescription>
}