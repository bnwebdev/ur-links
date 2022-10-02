import { LexemType } from "../../../lexer"
import { Token } from "../../../types"
import { Shot } from "./types"

export const equal = (token: Token<LexemType> | null,  shot: Shot) => {
    if (!token) {
        return false
    }

    if (typeof shot === 'string') {
        return token.type === shot
    }

    return token.type === shot.type && token.text === shot.text
}
