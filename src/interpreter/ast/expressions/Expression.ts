import { BinaryOperationSymbol } from "../../constants";
import { Runtime, RuntimeValueType } from "../../runtime";
import { AstNode } from "../AstNode";
import { Context } from "../Context";

export abstract class Expression extends AstNode {}

export abstract class ExpressionPrimitive extends Expression {}

export class ExpressionPrimitiveNumber extends ExpressionPrimitive {
    constructor(private value: number) { super() }

    execute(context: Context): Runtime {
        return new Runtime.Number(this.value)
    }

    toCode(): string {
        return this.value.toString()
    }
}

export class ExpressionPrimitiveBoolean extends ExpressionPrimitive {
    constructor(private value: boolean) { super() }

    execute(context: Context): Runtime {
        return new Runtime.Boolean(this.value)
    }

    toCode(): string {
        return this.value ? "true" : "false"
    }
}

export class ExpressionPrimitiveString extends ExpressionPrimitive {
    constructor(private value: string) { super() }

    execute(context: Context): Runtime {
        return new Runtime.String(this.value)        
    }

    toCode(): string {
        return `"${this.value}"`
    }
}

export class ExpressionPrimitiveNull extends ExpressionPrimitive {
    execute(context: Context): Runtime {
        return new Runtime.Null()
    }

    toCode(): string {
        return "null"
    }
}

export class ExpressionObject extends Expression {
    constructor(private object: Record<string, Runtime>) { super() }

    execute(context: Context): Runtime {
        return new Runtime.Object(this.object)
    }

    toCode(): string {
        return `{${Object.entries(this.object).map(([name, value]) => `${name}: ${value.toCode()}`).join(', ')}}`
    }
}

export abstract class ExpressionOperation extends Expression {}

export class ExpressionOperationUnion extends ExpressionOperation {
    constructor(private inside: AstNode) { super() }

    execute(context: Context): Runtime {
        return this.inside.execute(context)
    }

    toCode(): string {
        return `(${this.inside.toString()})`
    }
}

export abstract class ExpressionOperationUnary extends ExpressionOperation {
    constructor(protected node: AstNode) {
        super()
    }

    protected getNode(context: Context): Runtime {
        return this.node.execute(context)
    }
}

export class ExpressionOperationUnaryMinus extends ExpressionOperationUnary {
    execute(context: Context): Runtime {
        const node = Runtime.cast(this.getNode(context), Runtime.Number)
        return new Runtime.Number(-node)
    }

    toCode(): string {
        return `-${this.node.toCode()}`
    }
}         
    
export abstract class ExpressionOperationBinary extends ExpressionOperation {
    constructor(protected lhs: AstNode, protected rhs: AstNode) {
        super()
    }

    protected getLhs(context: Context): Runtime {
        return this.lhs.execute(context)
    }

    protected getRhs(context: Context): Runtime {
        return this.rhs.execute(context)
    }
    static Node(symbol: BinaryOperationSymbol) {
        switch (symbol) {
            case "*":
                return ExpressionOperationBinaryMultiply
            case "-":
                return ExpressionOperationBinarySubtraction
            case "/":
                return ExpressionOperationBinaryDivide
            case "+":
                return ExpressionOperationBinaryAddition
            case "==":
                return ExpressionOperationBinaryEqual
            case "!=":
                return ExpressionOperationBinaryNotEqual
            case "<":
                return ExpressionOperationBinaryLess
            case ">":
                return ExpressionOperationBinaryGreat
            case "||":
                return ExpressionOperationBinaryOr
            case "&&":
                return ExpressionOperationBinaryAnd
                            
            default:
                throw new Error(`Undefined operation symbol ${symbol}`)
        }
    }
}

export class ExpressionOperationBinaryAddition extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const lhs = this.getLhs(context)
        const rhs = this.getRhs(context)

        const lhsNumber = Runtime.tryCast(lhs, Runtime.Number)
        const rhsNumber = Runtime.tryCast(rhs, Runtime.Number)
        if (lhsNumber && rhsNumber) {
            return new Runtime.Number(lhsNumber.getValue() + rhsNumber.getValue())
        }

        return new Runtime.String(lhs.toString() + rhs.toString())
    }

    toCode(): string {
        return `${this.lhs.toCode()} + ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinarySubtraction extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const lhs = Runtime.cast(this.getLhs(context), Runtime.Number)
        const rhs = Runtime.cast(this.getRhs(context), Runtime.Number)

        return new Runtime.Number(lhs.getValue() - rhs.getValue())
    }

    toCode(): string {
        return `${this.lhs.toCode()} - ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryMultiply extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const lhs = Runtime.cast(this.getLhs(context), Runtime.Number)
        const rhs = Runtime.cast(this.getRhs(context), Runtime.Number)

        return new Runtime.Number(lhs.getValue() * rhs.getValue())
    }

    toCode(): string {
        return `${this.lhs.toCode()} * ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryEqual extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const rawLhs = this.getLhs(context)
        const rawRhs = this.getRhs(context)

        const lhs = Runtime.tryCast<RuntimeValueType<any>>(rawLhs, Runtime.ValueType as any)
        const rhs = Runtime.tryCast<RuntimeValueType<any>>(rawRhs, Runtime.ValueType as any)

        if (lhs && rhs) {
            return new Runtime.Boolean(lhs.getValue() == rhs.getValue()) // eslint-disable-line eqeqeq
        }

        const olhs = Runtime.tryCast(rawLhs, Runtime.Object)
        const orhs = Runtime.tryCast(rawRhs, Runtime.Object)

        if (olhs && orhs) {
            return new Runtime.Boolean(olhs === orhs)
        }

        return new Runtime.Boolean(false)
    }

    toCode(): string {
        return `${this.lhs.toCode()} == ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryLess extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const rawLhs = this.getLhs(context)
        const rawRhs = this.getRhs(context)

        const lhs = Runtime.tryCast<RuntimeValueType<any>>(rawLhs, Runtime.ValueType as any)
        const rhs = Runtime.tryCast<RuntimeValueType<any>>(rawRhs, Runtime.ValueType as any)

        if (lhs && rhs) {
            return new Runtime.Boolean(lhs.getValue() < rhs.getValue())
        }

        if (Runtime.tryCast(rawLhs, Runtime.Object) && Runtime.tryCast(rawRhs, Runtime.Object)) {
            return new Runtime.Boolean(false)
        }

        return new Runtime.Boolean(rawLhs.toString() < rawRhs.toString())
    }

    toCode(): string {
        return `${this.lhs.toCode()} < ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryGreat extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const rawLhs = this.getLhs(context)
        const rawRhs = this.getRhs(context)

        const lhs = Runtime.tryCast<RuntimeValueType<any>>(rawLhs, Runtime.ValueType as any)
        const rhs = Runtime.tryCast<RuntimeValueType<any>>(rawRhs, Runtime.ValueType as any)

        if (lhs && rhs) {
            return new Runtime.Boolean(lhs.getValue() > rhs.getValue())
        }

        if (Runtime.tryCast(rawLhs, Runtime.Object) && Runtime.tryCast(rawRhs, Runtime.Object)) {
            return new Runtime.Boolean(false)
        }

        return new Runtime.Boolean(rawLhs.toString() > rawRhs.toString())
    }

    toCode(): string {
        return `${this.lhs.toCode()} > ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryNotEqual extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const rawLhs = this.getLhs(context)
        const rawRhs = this.getRhs(context)

        const lhs = Runtime.tryCast<RuntimeValueType<any>>(rawLhs, Runtime.ValueType as any)
        const rhs = Runtime.tryCast<RuntimeValueType<any>>(rawRhs, Runtime.ValueType as any)

        if (lhs && rhs) {
            return new Runtime.Boolean(lhs.getValue() != rhs.getValue()) // eslint-disable-line eqeqeq
        }

        const olhs = Runtime.tryCast(rawLhs, Runtime.Object)
        const orhs = Runtime.tryCast(rawRhs, Runtime.Object)

        if (olhs && orhs) {
            return new Runtime.Boolean(olhs !== orhs)
        }

        return new Runtime.Boolean(rawLhs.toString() !== rawRhs.toString())
    }

    toCode(): string {
        return `${this.lhs.toCode()} != ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryAnd extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const lhs = this.getLhs(context)
        if (!lhs.toBoolean()) {
            return lhs
        }

        return this.getRhs(context)
    }

    toCode(): string {
        return `${this.lhs.toCode()} && ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryOr extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const lhs = this.getLhs(context)
        if (lhs.toBoolean()) {
            return lhs
        }

        return this.getRhs(context)
    }

    toCode(): string {
        return `${this.lhs.toCode()} || ${this.rhs.toCode()}`
    }
}

export class ExpressionOperationBinaryDivide extends ExpressionOperationBinary {
    execute(context: Context): Runtime {
        const lhs = Runtime.cast(this.getLhs(context), Runtime.Number)
        const rhs = Runtime.cast(this.getRhs(context), Runtime.Number)

        if (rhs.getValue() === 0) {
            throw new Error(`Cant divide by zero`)
        }

        return new Runtime.Number(lhs.getValue() / rhs.getValue())
    }

    toCode(): string {
        return `${this.lhs.toCode()} / ${this.rhs.toCode()}`
    }
}

export class ExpressionVariableAccess extends Expression {
    constructor(private path: string[], private name: string[]){ super() }

    execute(context: Context): Runtime {
        const ctx = this.path.reduce<Context>((ctx, namespace) => {
            if (namespace in ctx) {
                if (ctx[namespace] instanceof Runtime) {
                    throw new Error(`Path in variable access must go to the context and not to the runtime`)
                }

                return ctx[namespace] as Context
            }

            throw new Error(`Unexisted context`)
        }, context as Context)

        if (this.name.length === 0) {
            throw new Error(`Worng access`)
        }

        const first = this.name[0]
        const runtime = ctx[first]

        if (runtime instanceof Runtime) {
            return this.name.slice(1).reduce<Runtime>((obj: Runtime, name: string) => {
                return Runtime.cast(obj, Runtime.Object).getField(name)
            }, runtime)
    
        }

        throw new Error(`Unexpected runtime object`)
    }

    toCode(): string {
        return `${this.name.join('.')}`
    }
}
