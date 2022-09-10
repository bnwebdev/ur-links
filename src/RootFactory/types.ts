export enum RootType {
    NUMBER = 'number',
    STRING = 'string',
    ARRAY = 'array',
    OBJECT = 'object'
}

export interface BaseTypeDescription {
    type: RootType
}

export interface StringTypeDescription extends BaseTypeDescription {
    type: RootType.STRING
}

export interface NumberTypeDescription extends BaseTypeDescription {
    type: RootType.NUMBER
}

export type ArrayTypeDescription = {
    type: RootType.ARRAY
    itemType: TypeDescription
}

export type ObjectTypeDescription = {
    type: RootType.OBJECT
    fieldTypes: Record<string, TypeDescription> 
}

export type TypeDescription =
  | StringTypeDescription
  | NumberTypeDescription
  | ArrayTypeDescription
  | ObjectTypeDescription;