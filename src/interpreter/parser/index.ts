import { AstNode } from '../ast'
import { ExpressionPrimitiveNull } from '../ast/expressions'
import { StatementCodeList } from '../ast/statements'
import { LexemType } from '../lexer'
import { statementsHandlers, utilsHandlers, expressionsHandlers } from './handlers'
import { ParseType } from './constants'
import { isTokenOneOf } from './handlers/utils.ts'
import { Parser } from './Parser'

export * from './Parser'
export * from "./types"

const parser = new Parser<LexemType, ParseType>({
    root: ({ handle }) => {
        return handle(ParseType.CODE_LIST)
    },
    [ParseType.CODE_LIST]: ({ current, handle, next, expectCurrent }, stopers: LexemType[] = []) => {
        const codes: AstNode[] = []
        for (let token = current(); token && !isTokenOneOf(token, stopers); token = current()) {
            codes.push(handle(ParseType.CODE_BLOCK, [LexemType.SEMICOLON]))
            handle(ParseType.SHOTS, [LexemType.SEMICOLON], [LexemType.SPACE]);
        }

        return new StatementCodeList(codes)
    },
    [ParseType.CODE_BLOCK]: ({current, handle}, stopers: LexemType[] = []) => {
        handle(ParseType.SPACE)
        const token = current()
        if (token && isTokenOneOf(token, [LexemType.KEYWORD])) {
            return handle(ParseType.STATEMENT, stopers)
        } 
        return handle(ParseType.ROOT_EXPRESSION, undefined, stopers)
    },
    [ParseType.ROOT_EXPRESSION]: ({current, handle}, args?: AstNode, stopers: LexemType[] = []) => {
        const token = current()

        if (!token || isTokenOneOf(token, stopers)) {
            return args || new ExpressionPrimitiveNull()
        }

        return handle(ParseType.ROOT_EXPRESSION, handle(ParseType.BINARY_OPERATION, args), stopers)
    },
    ...expressionsHandlers,
    ...statementsHandlers,
    ...utilsHandlers
})

export default parser