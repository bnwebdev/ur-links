export type AppCreateHandler<Module extends any> = (module: Module) => Promise<void>;

export type BeforeAppCreateHandler<Module extends any> = AppCreateHandler<Module>;