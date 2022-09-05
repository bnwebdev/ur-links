import { Module } from "../../module-core";
import { initialize } from "./instance";

export * from './hooks'

export default new Module({
    onBeforeAppCreate: [async (modules) => initialize(modules.localizations)]
})