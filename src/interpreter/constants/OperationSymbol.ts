export enum BinaryOperationSymbol {
    ADD = "+",
    SUBTRACT = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    AND = "&&",
    OR = "||",
    EQUAL = "==",
    NOT_EQUAL = "!=",
    LESS = "<",
    GREAT = ">"
}

export enum UnaryOperationSymbol {
    NO = "!",
    MINUS = "-"
}

export type OperationSymbol = BinaryOperationSymbol | UnaryOperationSymbol

export enum BinaryOperationPriority {
    AND = 0,
    OR = 1,
    EQUAL = 2,
    NOT_EQUAL = 2,
    LESS = 2,
    GREAT = 2,
    SUBTRACT = 3,
    ADD = 3,
    MULTIPLY = 4,
    DIVIDE = 4,
}

export enum UnaryOperationPriority {
    NO,
    MINUS
}

export const PRIORITY_BY_SYMBOL: Record<BinaryOperationSymbol, number> = {
    [BinaryOperationSymbol.ADD]: BinaryOperationPriority.ADD,
    [BinaryOperationSymbol.AND]: BinaryOperationPriority.AND,
    [BinaryOperationSymbol.MULTIPLY]: BinaryOperationPriority.MULTIPLY,
    [BinaryOperationSymbol.DIVIDE]: BinaryOperationPriority.DIVIDE,
    [BinaryOperationSymbol.SUBTRACT]: BinaryOperationPriority.SUBTRACT,
    [BinaryOperationSymbol.OR]: BinaryOperationPriority.OR,
    [BinaryOperationSymbol.EQUAL]: BinaryOperationPriority.EQUAL,
    [BinaryOperationSymbol.NOT_EQUAL]: BinaryOperationPriority.NOT_EQUAL,
    [BinaryOperationSymbol.LESS]: BinaryOperationPriority.LESS,
    [BinaryOperationSymbol.GREAT]: BinaryOperationPriority.GREAT,
}
