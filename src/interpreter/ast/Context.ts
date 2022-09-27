import { Runtime } from "../runtime"

export type Context = 
| {
    [namespace: string]: Runtime
}
| {
    [namespace: string]: Context
}