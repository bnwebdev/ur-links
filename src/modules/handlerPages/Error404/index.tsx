import { Route } from "react-router-dom";
import { Module } from "../../../module-core/module";
import Error404 from "./Error404";

export default new Module({
    route: [ <Route path="*" element={<Error404 />}/>]
})