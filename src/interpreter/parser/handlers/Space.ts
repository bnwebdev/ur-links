import { ExpressionPrimitiveNull } from "../../ast/expressions"
import { LexemType } from "../../lexer"
import { TypedHandler } from "./types"

export const SpaceHandler: TypedHandler = ({ next, current }) => {
    while (current()?.type === LexemType.SPACE) {
        next()
    }

    return new ExpressionPrimitiveNull()
}