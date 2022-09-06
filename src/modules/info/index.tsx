import { Route } from "react-router-dom";

import { Module } from "../../module-core/module";
import { Info } from "./components";
import resources from "./locale";

export default new Module({
    navItemRight: [{ to: '/info', label: 'info.navLink' }],
    route: [<Route path="/info" element={<Info />}/>],
    localization: [{ namespace: 'info', resources }]
})