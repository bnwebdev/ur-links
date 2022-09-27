import { ScopeError } from "../../scope-error"
import { Token } from "../types"

export type Lexeme<Type extends string> = {
    regexp: string
    type: Type
    priority?: number
}

type NormalLexeme<Type extends string> = {
    regexp: RegExp
    type: Type
    priority: number
}

export class LexerError extends ScopeError.Scope("LexerError") {}

export class UndefinedLexeme extends LexerError.Type("UndefinedLexeme") {
    constructor(ypos: number, xpos: number, line: string) {
        super(`The undefined lexeme has been got at line ${ypos} at position ${xpos}\n${line}`)
    }
}

export class WrongRegExp extends LexerError.Type("WrongRegExp") {
    constructor(line: string, type: string, regexpResult: string) {
        super(`RegExp.exec return result with length === 0.\nLexemeType:${type}\nLine:${line}\nRegExpResult:${regexpResult}`)
    }
}

export class Lexer<Type extends string> {
    private lexemes: NormalLexeme<Type>[]

    constructor(lexemes: Lexeme<Type>[]) {
        this.lexemes = lexemes.map(({ type, regexp, priority }) => ({ 
            regexp: new RegExp(`^${regexp}`),
            type,
            priority: priority === undefined ? -1 : priority
        }))
    }

    tokenize(code: string){
        const tokens: Token<Type>[] = []
        let xpos = 0
        let ypos = 0
        let lines = code.split("\n")

        for (const line of lines) {
            xpos = 0

            while (line.length > xpos) {
                const subline = line.substring(xpos)
                const matched = this.lexemes.filter((lexeme) => lexeme.regexp.test(subline))

                if (matched.length === 0) {
                    throw new UndefinedLexeme(ypos, xpos, line)
                }

                const token = this.getToken(subline, matched, ypos, xpos)

                if (token.text.length === 0) {
                    throw new WrongRegExp(subline, token.type, token.text)
                }

                tokens.push(token)
                xpos += token.text.length
            }

            ypos++
        }

        return tokens
    }

    private getToken = (code: string, matchedLexemes: NormalLexeme<Type>[], line: number, pos: number): Token<Type> => {
        const matchedTokens = matchedLexemes.map(lexeme => ({
            line,
            pos,
            type: lexeme.type,
            text: (lexeme.regexp.exec(code) as RegExpExecArray)[0],
            priority: lexeme.priority
        }))

        const sortedByPriority = matchedTokens.sort((lhs, rhs) => rhs.priority - lhs.priority)
        const maxPriority = sortedByPriority[0].priority
        const filteredByPriority = sortedByPriority.filter(({priority}) => priority === maxPriority)

        const result = filteredByPriority.sort((lhs, rhs) => rhs.text.length - lhs.text.length)[0]

        return {
            pos: result.pos,
            line: result.line,
            text: result.text,
            type: result.type
        }
    }
}