import { ParseType } from "../../constants";
import { HandleOneOfHandler } from "./HandleOnOf";
import { ShotsHandler } from "./Shots";
import { SpaceHandler } from "./Space";

export const utilsHandlers = {
    [ParseType.SPACE]: SpaceHandler,
    [ParseType.SHOTS]: ShotsHandler,
    [ParseType.HANDLE_ONE_OF]: HandleOneOfHandler
}