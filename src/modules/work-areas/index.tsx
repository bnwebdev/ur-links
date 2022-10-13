import { Route } from "react-router-dom"

import { Module } from "../../module-core/module"

import { WorkAreas } from "./components"
import resources from "./locale"
import workArea from "./work-area"

export default new Module({
    route: [<Route path="/work-areas" element={<WorkAreas />}/>],
    navItem: [{ label: 'work-areas.navLink', to: '/work-areas' }],
    localization: [{ namespace: 'work-areas', resources }],
    storeDescription: { 
        workAreas: ['++id, label, *documentIds, *formatterIds', { store: '++id, label', version: 4 }],
        workAreaDocument: '++id, workAreaId, documentId',
        workAreaFormatter: '++id, workAreaId, formatterId',
    }
}, workArea)