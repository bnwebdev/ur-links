import { cloneElement, ReactElement } from "react"
import { RouteProps } from "react-router-dom"
import { CoreModule } from "./CoreModule"

export type NavItem = {
  to: string
  label: string
  children?: NavItem[]
}

export interface ModuleShape {
  navItem?: NavItem[]

  navItemRight?: NavItem[]

  route?: ReactElement<RouteProps>[]

  localization?: Array<{ ns: string; resources: Record<string, any> }>
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
}