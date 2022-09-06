import { Route } from "react-router-dom";
import { Module } from "../../../module-core/module";
import { DocumentMaker } from './components'

export default new Module({
    route: [<Route path="/documents/create" element={<DocumentMaker />} />]
})