import { ParseType } from "../../constants";
import { BinaryOperationHandler } from "./BinaryOperation";
import { ExpressionHandler } from "./Expression";
import { FunctionCallHandler } from "./FunctionCall";
import { NumberHandler } from "./Number";
import { StringHandler } from "./String";
import { VariableHandler } from "./Variable";

export const expressionsHandlers = {
    [ParseType.EXPRESSION]: ExpressionHandler,
    [ParseType.BINARY_OPERATION]: BinaryOperationHandler,
    [ParseType.VARIABLE]: VariableHandler,
    [ParseType.FUNCTION_CALL]: FunctionCallHandler,
    [ParseType.NUMBER]: NumberHandler,
    [ParseType.STRING]: StringHandler,
}