import { Module } from "../../module-core";
import resources from "./locale";

export default new Module({
    localization: [{ namespace: "common", resources }],
})