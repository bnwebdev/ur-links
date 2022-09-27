import { LexemType } from ".";
import { Lexeme } from "./Lexer";

export const protectToRegExp = (word: string) => word.split('').map(char => `\\${char}`).join('')

export const makeKeyword = (keyword: string, priority: number = 1): Lexeme<LexemType> => ({
    regexp: `\\b${keyword}\\b`,
    priority,
    type: LexemType.KEYWORD
})