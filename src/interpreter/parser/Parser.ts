import { ScopeError } from "../../scope-error";
import { Ref } from "../../utils";
import { AstNode } from "../ast";
import { Token } from "../types";
import { Handler, HandlerProps, HandlerType } from "./types";

export class ParserError extends ScopeError.Scope("ParserError") {}

const getShow = <TokenType extends string>(tokens: Token<TokenType>[], posRef: Ref<number>) => (offset: number = 0) => {
    const idx = posRef.value + offset

    return idx < 0 || idx >= tokens.length ? null : tokens[idx]
}
const getNext = <TokenType extends string>(tokens: Token<TokenType>[], posRef: Ref<number>) => () => {
    posRef.value++
    return tokens[posRef.value] || null
}
const getCurrent = <TokenType extends string>(tokens: Token<TokenType>[], posRef: Ref<number>) => () => {
    return tokens[posRef.value] || null
}

const getExpectCurrent = <TokenType extends string>(tokens: Token<TokenType>[], posRef: Ref<number>) => <ConcreteTokenType extends TokenType>(
    expectedType: TokenType,
): Token<ConcreteTokenType> => {
    const token = tokens[posRef.value] || null

    if (!token || token.type !== expectedType) {
        throw new Error(`Expected tokent with type ${expectedType}, but ${token ? `got ${token.type}`: "token is missed"}`)
    }

    return token as Token<ConcreteTokenType>
}

export class Parser<TokenType extends string, CustomHandlerTypes extends string> {
    constructor(private handlers: Record<HandlerType<CustomHandlerTypes>, Handler<TokenType, HandlerType<CustomHandlerTypes>>>) {}

    parse(tokens: Token<TokenType>[]): AstNode {
        let posRef = new Ref(0)

        const current = getCurrent(tokens, posRef)
        const expectCurrent = getExpectCurrent(tokens, posRef)
        const show = getShow(tokens, posRef)
        const next = getNext(tokens, posRef)
        const handle: HandlerProps<TokenType, HandlerType<CustomHandlerTypes>>["handle"] =
          (type, ...args) => this.handlers[type](manager(), ...args)

        function manager(): HandlerProps<TokenType, HandlerType<CustomHandlerTypes>> {
            return { current, next, handle, expectCurrent, show }
        }
        try {
            return this.handlers.root(manager())
        } catch (err) {
            console.error('ParserError', current(), err)
            throw err
        }
    }
}