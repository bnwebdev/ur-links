import { Route } from "react-router-dom";
import { Module } from "../../module-core/module";
import { DocumentTypes } from "./components";
import create from "./create";
import resources from "./locale";

export * from './types';
export * from './hooks';

export default new Module(
  {
    storeDescription: {
      documentTypes: '++id, name, fieldTypes'
    },
    route: [<Route path='/document-types' element={<DocumentTypes />} />],
    navItem: [{
      label: 'document-types.dropdownTitle', 
      children: [
        { to: '/document-types', label: 'document-types.navLink' },
        { to: '/document-types/create', label: 'document-types.submodules.create.navLink' }
      ]
    }],
    localization: [{ namespace: 'document-types', resources }],
  },
  create,
)