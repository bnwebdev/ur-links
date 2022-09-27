import { AstNode } from "../../ast";
import { ExpressionOperationBinary } from "../../ast/expressions";
import { BinaryOperationSymbol } from "../../constants";
import { LexemType } from "../../lexer";
import { lessBinaryOperator } from "../../utils";
import { ParseType } from "../constants";
import { TypedHandler } from "./types";

export const BinaryOperationHandler: TypedHandler = ({ handle, current, expectCurrent, next }, lhs?: AstNode) => {
    if (!lhs) {
        lhs = handle(ParseType.EXPRESSION)
    }
    
    handle(ParseType.SPACE) // skip spaces

    if (!current() || current()?.type !== LexemType.OPERATOR) {
        return lhs // eof
    }

    const { text } = expectCurrent(LexemType.OPERATOR)
    const operator = text as BinaryOperationSymbol
    next() // skip current operator

    let rhs = handle(ParseType.EXPRESSION)
    handle(ParseType.SPACE) // skip spaces

    const candidateOperator = current()
    const ConcreteExpressionOperationBynary = ExpressionOperationBinary.Node(operator)
    if (!candidateOperator || candidateOperator.type !== LexemType.OPERATOR) {
        return new ConcreteExpressionOperationBynary(lhs, rhs)
    }

    const { text: secondOperator } = candidateOperator as { text: BinaryOperationSymbol }

    if (lessBinaryOperator(operator, secondOperator)) {
        return new ConcreteExpressionOperationBynary(lhs, handle(ParseType.BINARY_OPERATION, rhs))
    }

    return new ConcreteExpressionOperationBynary(lhs, rhs)
    
}