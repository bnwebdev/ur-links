import { Runtime } from "../runtime";
import { Context } from "./Context";

export abstract class AstNode {
    abstract execute(context: Context): Runtime;

    abstract toCode(): string;
}
