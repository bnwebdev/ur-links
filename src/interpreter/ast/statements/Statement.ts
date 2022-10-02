import { Runtime } from "../../runtime";
import { AstNode } from "../AstNode";
import { Context } from "../Context";
import { ExpressionVariableAccess } from "../expressions";

export abstract class Statement extends AstNode {}

export class StatementCodeList extends Statement {
    constructor(private codes: AstNode[]) { super() }

    execute(context: Context): Runtime {
        return this.codes.map(code => code.execute(context)).reverse()[0] || new Runtime.Null()
    }

    toCode(): string {
        return `${this.codes.map(code => code.toCode()).join(';')}${this.codes.length ? ";": ""}` 
    }
}

export class StatementFunction extends AstNode {
    constructor(private name: string, private body: AstNode, private argNames: string[]) { super() }

    execute(context: Context): Runtime {
        return context[this.name] = new Runtime.Function(this.name, this.body, this.argNames)
    }

    toCode(): string {
        return `function ${this.name}(${this.argNames.join(', ')}){ ${this.body.toCode()} }`
    }
}

export class StatementFunctionCall extends AstNode {
    constructor(private variableAccess: ExpressionVariableAccess, private args: AstNode[]) {
        super()
    }

    execute(context: Context): Runtime {
        const runtime = this.variableAccess.execute(context)
        const fn = Runtime.cast(runtime, Runtime.Function)
        try {
            fn.call(this.args.map(arg => arg.execute(context)), context)
            return new Runtime.Null()
        } catch (e) {
            if (e instanceof Runtime) {
                return e
            }
            throw e
        }
    }

    toCode(): string {
        return `${this.variableAccess.toCode()}(${this.args.map(arg => arg.toCode()).join(', ')})`
    }
}

export class StatementPrint extends AstNode {
    constructor(private toPrints: AstNode[]) { super() }

    execute(context: Context): Runtime {
        console.log(...this.toPrints.map(node => node.execute(context).toString()))
        return new Runtime.Null()
    }

    toCode(): string {
        return `print ${this.toPrints.map(pr => pr.toCode())}`
    }
}

export class StatementIf extends Statement {
    constructor(private condition: AstNode, private action: AstNode) {
        super()
    }

    execute(context: Context): Runtime {
        if (this.condition.execute(context).toBoolean()) {
            return this.action.execute(context)
        }

        return new Runtime.Null()
    }

    toCode(): string {
        return `if (${this.condition.toCode()}) { ${this.action.toCode()} }`
    }
}
export class StatementIfElse extends Statement {
    constructor(private condition: AstNode, private action: AstNode, private elseAction: AstNode) {
        super()
    }

    execute(context: Context): Runtime {
        if (this.condition.execute(context).toBoolean()) {
            return this.action.execute(context)
        } else {
            return this.elseAction.execute(context)
        }
    }

    toCode(): string {
        return `if (${this.condition.toCode()}) { ${this.action.toCode()} } else { ${this.elseAction.toCode()} }`
    }
}

export class StatementReturn extends Statement {
    constructor(private returnValue: AstNode) {
        super()
    }
    execute(context: Context): Runtime {
        throw this.returnValue.execute(context)
    }

    toCode(): string {
        return `return ${this.returnValue.toCode()}`
    }
}