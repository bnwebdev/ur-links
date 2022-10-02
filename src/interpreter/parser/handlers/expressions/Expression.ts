import {
    ExpressionOperationUnaryMinus,
    ExpressionOperationUnion,
    ExpressionPrimitiveBoolean,
    ExpressionPrimitiveNull
} from "../../../ast/expressions"
import { UnaryOperationSymbol } from "../../../constants"
import { LexemType } from "../../../lexer"
import { ParseType } from "../../constants"
import { TypedHandler } from "../types"

export const ExpressionHandler: TypedHandler = ({ current, handle, next, expectCurrent }) => {
    handle(ParseType.SPACE)
    const token = current()

    if (!token) {
        return new ExpressionPrimitiveNull()
    }

    switch(token.type) {
        case LexemType.NUMBER:
            return handle(ParseType.NUMBER)
        case LexemType.NULL:
            next() // skip null
            return new ExpressionPrimitiveNull()
        case LexemType.QUOTES:
            return handle(ParseType.STRING)
        case LexemType.VARIABEL:
            return handle(ParseType.VARIABLE)     
        case LexemType.BOOLEAN:
            next() // skip boolean
            return new ExpressionPrimitiveBoolean(token.text === "true")
        case LexemType.OPEN_PAREN:
            next();
            const insidePart = handle(ParseType.ROOT_EXPRESSION, undefined, [LexemType.CLOSE_PAREN])
            expectCurrent(LexemType.CLOSE_PAREN)
            next()
            return new ExpressionOperationUnion(insidePart)
        case LexemType.OPERATOR: {
            if (token.text === UnaryOperationSymbol.MINUS) {
                next() // skip operator
                return new ExpressionOperationUnaryMinus(handle(ParseType.EXPRESSION))
            }
            throw new Error(`Cant handle this operator ${token.text}`)
        }
        default:
            throw new Error(`Cant handle this type ${token.type}`)
    }
}