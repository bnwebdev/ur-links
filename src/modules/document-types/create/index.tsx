import { Route } from "react-router-dom";

import { Module } from "../../../module-core/module";
import { DocumentTypeMaker } from "./components";

export default new Module({
    route: [<Route path='/document-types/create' element={<DocumentTypeMaker />} />]
})