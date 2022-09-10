import { Route } from "react-router-dom";
import { Module } from "../../../module-core/module";
import NotImplemented from './NotImplemented'

export default new Module({
    route: [<Route path="/not-implemented" element={<NotImplemented />} />]
})