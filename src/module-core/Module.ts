import { cloneElement, ReactElement } from "react"
import { RouteProps } from "react-router-dom"

import { StoresDescription } from "../modules/database"
import { AppContext, AppCreateHandler, BeforeAppCreateHandler, Localization, NavItem } from "../types"
import { CoreModule } from "./CoreModule"

export interface ModuleShape {
  navItem?: NavItem[]

  navItemRight?: NavItem[]

  route?: ReactElement<RouteProps>[]

  localization?: Localization[]

  contextMaker?: Array<<Values extends keyof AppContext>() => Pick<AppContext, Values>>

  onAppCreate?: Array<AppCreateHandler<Module>>

  onBeforeAppCreate?: Array<BeforeAppCreateHandler<Module>>

  storeDescription?: Partial<StoresDescription>
}

export interface Module extends ModuleShape {}

export class Module extends CoreModule {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(...modules: ModuleShape[]){
    super(...modules)
  }

  get navItems() {
    const left = this.navItem || []
    const right = this.navItemRight || []
    return [...left, ...right]
  }

  get routes() {
    return (this.route || []).map((item, idx) => cloneElement(item, { key: item.key || idx }))
  }

  get localizations() {
    return this.localization || []
  }

  get context(): AppContext {
    return this.contextMaker?.reduce(
      (partial, maker) => ({ ...partial, ...maker() }),
      {} as AppContext
    ) || {} as AppContext
  }

  async initialize(): Promise<void> {
    await (this.onBeforeAppCreate || []).reduce(async (promise, onBeforeAppCreate) => {
      await promise;
      return onBeforeAppCreate(this)
    }, Promise.resolve())

    return (this.onAppCreate || []).reduce(async (promise, onAppCreate) => {
        await promise;
        return onAppCreate(this)
      }, Promise.resolve())
  }
}