import { Route } from "react-router-dom";
import resources from './locale'

import { Module } from "../../module-core/module";
import { ListLinks } from "./components";
import create from "./create";

export * from './types'

export default new Module(
    {
        navItem: [
            {
                label: "documents.dropdownTitle",
                children: [
                    { to: '/', label: 'documents.navLink' },
                    { to: '/documents/create', label: "documents.submodules.create.navLink" },
                ]
            }
        ],
        route: [<Route path="/" element={<ListLinks />} />],
        storeDescription: {
            documents: [
                '++id, title, authors, type, meta',
                '++id, type, meta'
            ]
        },
        localization: [{ namespace: 'documents', resources }]
    },
    create,
)