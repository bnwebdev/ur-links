import { StatementIf, StatementIfElse } from "../../../ast/statements";
import { LexemType } from "../../../lexer";
import { ParseType } from "../../constants";
import { TypedHandler } from "../types";
import { equal } from "../utils-handlers/utils";

export const StatementIfHandler: TypedHandler = ({ current, handle, next }) => {
        handle(ParseType.SHOTS, [{ type: LexemType.KEYWORD, text: "if" }, LexemType.OPEN_PAREN], [LexemType.SPACE])

        const expr = handle(ParseType.ROOT_EXPRESSION, undefined, [LexemType.CLOSE_PAREN])

        handle(ParseType.SHOTS, [LexemType.CLOSE_PAREN, LexemType.OPEN_BRACES], [LexemType.SPACE])
        
        const block = handle(ParseType.CODE_LIST, [LexemType.CLOSE_BRACES])
        handle(ParseType.SHOTS, [LexemType.CLOSE_BRACES], [LexemType.SPACE])

        if (equal(current(), { type: LexemType.KEYWORD, text: "else" })) {
            next() // skip else
            handle(ParseType.SPACE) // skip spaces

            if(equal(current(), LexemType.OPEN_BRACES)) {
                next() // skip {
                const elseBlock = handle(ParseType.CODE_LIST, [LexemType.CLOSE_BRACES])
                handle(ParseType.SHOTS, [LexemType.CLOSE_BRACES], [LexemType.SPACE])

                return new StatementIfElse(expr, block, elseBlock)
            }

            const anotherIfBlock = handle(ParseType.STATEMENT_IF)
            
            return new StatementIfElse(expr, block, anotherIfBlock)
        }

        return new StatementIf(expr, block)
}