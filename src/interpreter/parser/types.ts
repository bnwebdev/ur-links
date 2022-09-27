import { AstNode } from "../ast"
import { Token } from "../types"

export type Root = "root"

export type HandlerType<CustomHandlerTypes extends string> = Root | CustomHandlerTypes

export type TokenHandler<TokenType extends string> = () => Token<TokenType> | null

export type ExpectTokenHandler<TokenType extends string> = <ConcreteTokenType extends TokenType>(expectedType: ConcreteTokenType) => Token<ConcreteTokenType>
export type ShowTokenHandler<TokenType extends string> = (offset?: number) => Token<TokenType> | null

export type HandlerProps<TokenType extends string, HandlerType extends string> = {
    current: TokenHandler<TokenType>
    next: TokenHandler<TokenType>
    show: ShowTokenHandler<TokenType>
    expectCurrent: ExpectTokenHandler<TokenType>
    handle: (type: HandlerType, ...args: any[]) => AstNode
}

export type Handler<TokenType extends string, HandlerType extends string> = {
    (props: HandlerProps<TokenType, HandlerType>, ...args: any[]): AstNode
}
