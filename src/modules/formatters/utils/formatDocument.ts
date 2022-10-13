import { Context } from "../../../interpreter/ast/Context"
import lexer from "../../../interpreter/lexer"
import parser from "../../../interpreter/parser"
import { Runtime, RuntimeFunction } from "../../../interpreter/runtime"
import { runtimize } from "./runtimize"


const callAst = parser.parse(lexer.tokenize(`format(document);`))

export const formatDocument = (context: Context & {format: RuntimeFunction}, document: Record<string, any>) => {
    const runtime = callAst.execute({
        ...context,
        document: runtimize(document)
    })

    return Runtime.cast(runtime, Runtime.String).getValue()
}