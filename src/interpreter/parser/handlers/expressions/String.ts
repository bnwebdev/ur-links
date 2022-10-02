import { ExpressionPrimitiveString } from "../../../ast/expressions";
import { LexemType } from "../../../lexer";
import { TypedHandler } from "../types";

export const StringHandler: TypedHandler = ({ expectCurrent, current, next }) => {
    expectCurrent(LexemType.QUOTES)
    next() // skip open quote "

    const parts: string[] = []
    for(let cur = current(); cur && cur.type !== LexemType.QUOTES; cur = next()) {
        parts.push(cur.text)
    }

    expectCurrent(LexemType.QUOTES)
    next() // skip close quote "

    return new ExpressionPrimitiveString(parts.join(""))
}