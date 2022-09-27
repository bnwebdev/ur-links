export type Token<Type extends string> = {
    text: string
    type: Type
    pos: number
    line: number
}