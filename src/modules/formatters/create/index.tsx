import { Route } from "react-router-dom";

import { Module } from "../../../module-core/module";
import { FormatterMaker } from "./components";

export default new Module({
    route: [<Route path="/formatters/create" element={<FormatterMaker />}/>]
})