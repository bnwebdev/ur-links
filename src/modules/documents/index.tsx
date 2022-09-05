import { Route } from "react-router-dom";
import resources from './locale'

import { Module } from "../../module-core";
import { ListLinks } from "./list";

export * from './types'

export default new Module({
    navItem: [{ to: '/', label: 'documents.navLink' }],
    route: [<Route path="/" element={<ListLinks />} />],
    storeDescription: {
        documents: '++id, type, name, authors, meta'
    },
    localization: [{ namespace: 'documents', resources }]
})