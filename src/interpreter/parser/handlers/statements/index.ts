import { ParseType } from "../../constants";
import { StatementIfHandler } from "./If";
import { StatementHandler } from "./Statement";

export const statementsHandlers = {
    [ParseType.STATEMENT_IF]: StatementIfHandler,
    [ParseType.STATEMENT]: StatementHandler
}