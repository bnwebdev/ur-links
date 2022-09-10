import { Module } from "../../module-core/module";
import resources from "./locale";

export * from './hooks'
export * from './utils'

export default new Module({
    localization: [{ namespace: "common", resources }],
})