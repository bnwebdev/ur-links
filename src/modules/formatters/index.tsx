import { Route } from "react-router-dom"
import { Module } from "../../module-core/module"
import { Formatters } from "./components"
import resources from "./locale"

export default new Module({
    route: [<Route path="/formatters" element={<Formatters />}/>],
    navItem: [{ label: 'formatters.navLink', to: '/not-implemented' }],
    localization: [{ namespace: 'formatters', resources }],
    storeDescription: { formatters: '++id, type, rules' }
})