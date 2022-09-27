import { AstNode } from "../ast"
import { Context } from "../ast/Context"

export abstract class Runtime {
    abstract toCode(): string
    // Own fields:
    abstract toBoolean(): boolean
    abstract toString(): string

    static Null: typeof RuntimeNull
    static Number: typeof RuntimeNumber
    static Boolean: typeof RuntimeBoolean
    static String: typeof RuntimeString
    static Object: typeof RuntimeObject
    static Function: typeof RuntimeFunction
    static ValueType: typeof RuntimeValueType

    static cast: <T extends Runtime>(runtime: Runtime, parent: { new (...args: any[]): T }) => T
    static tryCast: <T extends Runtime>(runtime: Runtime, parent: { new (...args: any[]): T }) => T | null
    static fromJSON: (src: string) => Runtime
}

Runtime.cast = <T extends Runtime>(runtime: Runtime, parent: { new (...args: any[]): T }): T => {
    if (runtime instanceof parent) {
        return runtime
    }

    throw new Error(`Not expected type. Expected ${parent.name}, got ${(runtime as Object).constructor.name}`)
}

Runtime.tryCast = <T extends Runtime>(runtime: Runtime, parent: { new (...args: any[]): T }): T | null => {
    try {
        return Runtime.cast<T>(runtime, parent)
    } catch (err) {
        return null
    }
}

export abstract class RuntimeValueType<Value extends { toString(): string }> extends Runtime {
    constructor(private value: Value) { super() }
    toBoolean(): boolean {
        return !!this.value
    }
    toString(): string {
        return this.getValue().toString()
    }
    getValue(): Value {
        return this.value
    }
    toCode(): string {
        return this.value.toString()
    }
}
Runtime.ValueType = RuntimeValueType

export class RuntimeNumber extends RuntimeValueType<number> {}
Runtime.Number = RuntimeNumber

export class RuntimeString extends RuntimeValueType<string> {}
Runtime.String = RuntimeString

export class RuntimeBoolean extends RuntimeValueType<boolean> {
    toCode(): string {
        return this.getValue()? 'true': 'false'
    }
}
Runtime.Boolean = RuntimeBoolean

export class RuntimeNull extends Runtime {

    toBoolean(): boolean {
        return false
    }
    toString(): string {
        return ""
    }
    toCode(): string {
        return `null`
    }
}
Runtime.Null = RuntimeNull

export class RuntimeObject extends Runtime {
    constructor(private object: Record<string, Runtime>) { super() }
    
    getField(name: string): Runtime {
        if (this.object.hasOwnProperty(name)) {
            return this.object[name]
        }
        throw new Error(`Field with name ${name} isn't existed`)
    }
    toBoolean(): boolean {
        return true
    }
    toString(): string {
        if (this.object.hasOwnProperty("toString")) {
            const fn = Runtime.cast(this.object["toString"], Runtime.Function)
            fn.call([], {})
        }
        return "[Object]"
    }

    toCode(): string {
        return `{${Object.entries(this.object).map(([name, value]) => `${name}: ${value.toCode()}`).join(', ')}}`
    }
}
Runtime.Object = RuntimeObject

export class RuntimeFunction extends Runtime {
    constructor(private name: string, private body: AstNode, private argNames: string[]){ super() }

    toBoolean(): boolean {
        return true
    }

    toString(): string {
        return "[Function]"
    }

    call(args: Runtime[], context: Context) {
        const insideContext = { ...context }
        for (let idx = 0; idx < this.argNames.length; idx++) {
            insideContext[this.argNames[idx]] = args[idx] || new Runtime.Null()
        }

        return this.body.execute(insideContext)
    }

    toCode(): string {
        return `function ${this.name}(${this.argNames.join(', ')}){ ${this.body.toCode()} }`
    }
}
Runtime.Function = RuntimeFunction