import { LexemType } from "../../../lexer";
import { Token } from "../../../types";
import { ParseType } from "../../constants";

export type Shot = LexemType | Pick<Token<LexemType>, 'type' | 'text'>

export type HandleShot = {
    condition: Shot,
    handler: ParseType,
    args: any[]
}