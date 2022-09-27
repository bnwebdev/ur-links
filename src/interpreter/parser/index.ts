import { AstNode } from '../ast'
import { ExpressionPrimitiveNull } from '../ast/expressions'
import { StatementCodeList } from '../ast/statements'
import { LexemType } from '../lexer'
import { FunctionCallHandler, NumberHandler, SpaceHandler, StringHandler, VariableHandler } from './handlers'
import { BinaryOperationHandler } from './handlers/BinaryOperation'
import { ExpressionHandler } from './handlers/Expression'
import { StatementHandler } from './handlers/Statement'
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
            expectCurrent(LexemType.SEMICOLON)
            next()// skip semicolon
            handle(ParseType.SPACE)
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
    [ParseType.EXPRESSION]: ExpressionHandler,
    [ParseType.STATEMENT]: StatementHandler,
    [ParseType.BINARY_OPERATION]: BinaryOperationHandler,
    [ParseType.VARIABLE]: VariableHandler,
    [ParseType.FUNCTION_CALL]: FunctionCallHandler,
    [ParseType.NUMBER]: NumberHandler,
    [ParseType.STRING]: StringHandler,
    [ParseType.SPACE]: SpaceHandler
})

export default parser