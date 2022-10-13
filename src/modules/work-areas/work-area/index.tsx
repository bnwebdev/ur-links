import { Route } from "react-router-dom";

import { Module } from "../../../module-core/module";
import { WorkArea } from "./components";

export default new Module({
    route: [<Route path="/work-areas/:id" element={<WorkArea />}/>]
})