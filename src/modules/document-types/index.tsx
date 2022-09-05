import { Route } from "react-router-dom";
import { Module } from "../../module-core";
import { DocumentTypes } from "./components";
import create from "./create";
import resources from "./locale";

export * from './types';

export default new Module(
  {
    storeDescription: {
      documentTypes: '++id, name, fieldTypes'
    },
    route: [<Route path='/document-types' element={<DocumentTypes />} />],
    navItem: [{ to: '/document-types', label: 'document-types.navLink' }],
    localization: [{ namespace: 'document-types', resources }],
  },
  create,
)