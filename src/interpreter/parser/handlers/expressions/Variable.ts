import { ExpressionVariableAccess } from "../../../ast/expressions";
import { LexemType } from "../../../lexer";
import { ParseType } from "../../constants";
import { TypedHandler } from "../types";
import { isTokenOneOf } from "../utils.ts";

export const VariableHandler: TypedHandler = ({ current, handle, expectCurrent, next }) => {
    const { text } = expectCurrent(LexemType.VARIABEL)
    next() // skip variable
    handle(ParseType.SPACE) // skip spaces
    const token = current()
    const namePath: string[] = [text]

    if (token && isTokenOneOf(token, [LexemType.DOT])) {
        for (let dot = current(); dot && isTokenOneOf(dot, [LexemType.DOT]); dot = current()) {
            next() // skip dot
            handle(ParseType.SPACE) // skip spaces

            namePath.push(expectCurrent(LexemType.VARIABEL).text)
            next() // skip variable
            handle(ParseType.SPACE) // skip spaces
        }
    }

    if (!token || !isTokenOneOf(token, [LexemType.OPEN_PAREN])) {
        return new ExpressionVariableAccess([], namePath)
    }

    return handle(ParseType.FUNCTION_CALL, namePath)
}