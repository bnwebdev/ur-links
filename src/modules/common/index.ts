import { Module } from "../../module-core/module";
import resources from "./locale";

export default new Module({
    localization: [{ namespace: "common", resources }],
})