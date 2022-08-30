import { Route } from "react-router-dom";

import { Module } from "../../module-core";
import { Info } from "./components";

export default new Module({
    navItemRight: [{ to: '/info', label: 'Info' }],
    route: [<Route path="/info" element={<Info />}/>]
})