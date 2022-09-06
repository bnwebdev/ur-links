import { foldTo } from "fractal-objects";

export interface CoreModuleShape {}

export interface CoreModule extends CoreModuleShape {}

export class CoreModule {
    constructor(...modules: CoreModuleShape[]){
        foldTo(this, modules)
    }
}