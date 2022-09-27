import { LexemType } from "../../../lexer"
import { Token } from "../../../types"

export const isTokenOneOf = (token: Token<LexemType>, types: LexemType[] = []) => {
    return types.some((type) => type === token.type)
}