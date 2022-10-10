import { AstNode } from "../../../ast";
import { StatementFunction, StatementPrint, StatementReturn } from "../../../ast/statements";
import { LexemType } from "../../../lexer";
import { ParseType } from "../../constants";
import { TypedHandler } from "../types";
import { isTokenOneOf } from "../utils.ts";

export const StatementHandler: TypedHandler = ({ expectCurrent, next, current, handle }, stopers: LexemType[]) => {
    const { text } = expectCurrent(LexemType.KEYWORD)

    switch (text) {
        case "print": {
            next() // skip keyword
            handle(ParseType.SPACE)

            const toPrints: AstNode[] = []
            for (
                let token = current();
                token && !isTokenOneOf(token, [LexemType.COMMA, LexemType.SEMICOLON]);
                token = current()
            ) {
                toPrints.push(handle(ParseType.ROOT_EXPRESSION, undefined, [LexemType.COMMA, LexemType.SEMICOLON]))
                handle(ParseType.SPACE)

                const token = current()
                if (token && isTokenOneOf(token, [LexemType.COMMA])) {
                    next() // skip comma
                    handle(ParseType.SPACE) // skip space
                    const check = current()
                    if (check && isTokenOneOf(check, [LexemType.COMMA, LexemType.SEMICOLON])) {
                        throw new Error(`Missed expression`)
                    }
                }
            }
            handle(ParseType.SPACE)
            return new StatementPrint(toPrints)
        }
        case "if": return handle(ParseType.STATEMENT_IF);
        case "function": {
            next() // skip keyword
            handle(ParseType.SPACE)

            const { text: name } = expectCurrent(LexemType.VARIABEL)
            next() // skip name
            handle(ParseType.SPACE) // skip spaces

            expectCurrent(LexemType.OPEN_PAREN)
            next() // skip (

            const argNames: string[] = []
            for (let token = current(); token && isTokenOneOf(token, [LexemType.VARIABEL]); token = current()) {
                const { text: argName } = expectCurrent(LexemType.VARIABEL)
                argNames.push(argName)
                next() // skip arg name
                handle(ParseType.SPACE) // skip spaces

                const comma = current()
                if(comma && isTokenOneOf(comma, [LexemType.COMMA])) {
                    next() // skip comma
                    handle(ParseType.SPACE) // skip spaces
                    expectCurrent(LexemType.VARIABEL)
                }
            }
            expectCurrent(LexemType.CLOSE_PAREN);
            next() // skip )
            handle(ParseType.SPACE) // skip spaces

            expectCurrent(LexemType.OPEN_BRACES)
            next() // skip {
            handle(ParseType.SPACE)
            const body = handle(ParseType.CODE_LIST, [LexemType.CLOSE_BRACES])
            expectCurrent(LexemType.CLOSE_BRACES)
            next() // skip }

            return new StatementFunction(name, body, argNames)
        }
        case "return": {
            next() // skip keyword
            handle(ParseType.SPACE)
            const body = handle(ParseType.ROOT_EXPRESSION, undefined, stopers)

            return new StatementReturn(body)
        }
        default:
            throw new Error(`Undefined keyword ${text}`)
    }
}