import { Module } from "../../module-core";

export * from './types';

export default new Module({
    storeDescription: {
        documentTypes: '++id, name, fieldTypes'
    }
})