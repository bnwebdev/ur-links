import { ExpressionPrimitiveNumber } from "../../ast/expressions"
import { LexemType } from "../../lexer"
import { TypedHandler } from "./types"

export const NumberHandler: TypedHandler = ({ expectCurrent, next }) => {
    const { text } = expectCurrent(LexemType.NUMBER)
    next() // skip number
    
    return new ExpressionPrimitiveNumber(Number(text))
}