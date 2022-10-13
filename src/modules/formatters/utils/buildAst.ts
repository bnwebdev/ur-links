import lexer from "../../../interpreter/lexer"
import parser from "../../../interpreter/parser"

export const buildAst = (code: string) => {
    const tokens = lexer.tokenize(code)
    return parser.parse(tokens)
}