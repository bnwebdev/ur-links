import { BinaryOperationSymbol, UnaryOperationSymbol } from '../constants'
import { Lexer } from './Lexer'
import { makeKeyword, protectToRegExp } from './utils'

export * from './Lexer'

export enum LexemType {
    NUMBER = "number",
    OPEN_PAREN = "left-parenthesis",
    CLOSE_PAREN = "right-parenthesis",
    OPEN_BRACES = "open-braces",
    CLOSE_BRACES = "close-braces",
    ID = "id",
    OPERATOR = "operator",
    SPACE = "space",
    QUOTES = "quotes",
    VARIABEL = "variable",
    SEMICOLON = "semicolon",
    KEYWORD = "keyword",
    COMMA = "comma",
    DOT = "dot",
    BOOLEAN = "boolean",
    UNKNOWN = "unknown lexeme",
    NULL = "null"
}

export default new Lexer([
    {
        regexp: "[0-9]+(\\.[0-9]+)?",
        type: LexemType.NUMBER
    },
    {
        regexp: "\\btrue\\b",
        type: LexemType.BOOLEAN,
        priority: 1
    },
    {
        regexp: "\\bfalse\\b",
        type: LexemType.BOOLEAN,
        priority: 1
    },
    {
        regexp: "\\bnull\\b",
        type: LexemType.NULL,
        priority: 1
    },
    {
        regexp: "\\(",
        type: LexemType.OPEN_PAREN
    },
    {
        regexp: "\\)",
        type: LexemType.CLOSE_PAREN
    },
    {
        regexp: "\\{",
        type: LexemType.OPEN_BRACES
    },
    {
        regexp: "\\}",
        type: LexemType.CLOSE_BRACES
    },
    {
        regexp: `\\${BinaryOperationSymbol.MULTIPLY}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.ADD}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.SUBTRACT}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.DIVIDE}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.EQUAL}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.NOT_EQUAL}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.LESS}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${BinaryOperationSymbol.GREAT}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: protectToRegExp(BinaryOperationSymbol.AND),
        type: LexemType.OPERATOR
    },
    {
        regexp: protectToRegExp(BinaryOperationSymbol.OR),
        type: LexemType.OPERATOR
    },
    {
        regexp: `\\${UnaryOperationSymbol.NO}`,
        type: LexemType.OPERATOR
    },
    {
        regexp: "\\s+",
        type: LexemType.SPACE
    },
    {
        regexp: "\"",
        type: LexemType.QUOTES
    },
    {
        regexp: "[a-zA-Z]+",
        type: LexemType.VARIABEL
    },
    {
        regexp: ";",
        type: LexemType.SEMICOLON
    },
    {
        regexp: ",",
        type: LexemType.COMMA
    },
    {
        regexp: protectToRegExp("."),
        type: LexemType.DOT
    },
    {
        regexp: ".",
        type: LexemType.UNKNOWN,
        priority: -10
    },
    ...["print", "if", "else", "function", "return"].map(makeKeyword)
])