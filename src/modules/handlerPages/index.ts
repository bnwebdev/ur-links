import { Module } from "../../module-core/module";
import Error404 from "./Error404";
import NotImplemented from "./NotImplemented";
import resources from './locale'

export default new Module(
    {
        localization: [{ namespace: 'handlerPages', resources }]
    },
    NotImplemented,
    Error404,
)