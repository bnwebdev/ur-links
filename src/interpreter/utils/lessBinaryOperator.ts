import { BinaryOperationSymbol, PRIORITY_BY_SYMBOL } from "../constants";

export const lessBinaryOperator = (lhs: BinaryOperationSymbol, rhs: BinaryOperationSymbol) =>
    PRIORITY_BY_SYMBOL[lhs] < PRIORITY_BY_SYMBOL[rhs]