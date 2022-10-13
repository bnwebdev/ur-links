import { AstNode } from "../../../interpreter/ast"
import { Context } from "../../../interpreter/ast/Context"
import { Runtime, RuntimeFunction } from "../../../interpreter/runtime"

export const prepareRuntimeContextWithFormatter = (ast: AstNode) => {
    const context: Context = {}
    ast.execute(context)
    
    if (!context.format || !Runtime.tryCast(context.format as Runtime, Runtime.Function)) {
        throw new Error(
            `Error: You must create function with name format, that use one argument (it will be document described with type)`
        )
    }

    return context as Context & { format: RuntimeFunction }
}