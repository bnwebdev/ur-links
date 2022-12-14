import { Route } from "react-router-dom"
import { Module } from "../../module-core/module"
import { WorkAreas } from "./components"
import resources from "./locale"

export default new Module({
    route: [<Route path="/work-areas" element={<WorkAreas />}/>],
    navItem: [{ label: 'work-areas.navLink', to: '/work-areas' }],
    localization: [{ namespace: 'work-areas', resources }],
    storeDescription: { workAreas: '++id, label, *documentIds, *formatterIds' }
})