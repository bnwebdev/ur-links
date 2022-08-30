import { Route } from "react-router-dom";

import { Module } from "../../module-core";
import { ListLinks } from "./list";

export default new Module({
    navItem: [{ to: '/', label: 'Home' }],
    route: [<Route path="/" element={<ListLinks />} />]

})