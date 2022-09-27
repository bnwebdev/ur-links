import { AstNode } from "../../ast";
import { ExpressionVariableAccess } from "../../ast/expressions";
import { StatementFunctionCall } from "../../ast/statements";
import { LexemType } from "../../lexer";
import { ParseType } from "../constants";
import { TypedHandler } from "./types";
import { isTokenOneOf } from "./utils.ts";

export const FunctionCallHandler: TypedHandler = ({ expectCurrent, next, current, handle }, name: string) => {
    expectCurrent(LexemType.OPEN_PAREN)
    next() // skip (
    
    const args: AstNode[] = []

    for (
        let token = current();
        token && !isTokenOneOf(token, [LexemType.CLOSE_PAREN]);
        token = current()
    ) {
        args.push(handle(ParseType.ROOT_EXPRESSION, undefined, [LexemType.CLOSE_PAREN, LexemType.COMMA]))
        handle(ParseType.SPACE) // skip spaces
        const comma = current()
        
        if (comma && isTokenOneOf(comma, [LexemType.COMMA])) {
            next() // skip comma
            handle(ParseType.SPACE) // skip spaces
        }
    }
    expectCurrent(LexemType.CLOSE_PAREN)
    next() // skip )

    return new StatementFunctionCall(new ExpressionVariableAccess([], [name]), args)
}