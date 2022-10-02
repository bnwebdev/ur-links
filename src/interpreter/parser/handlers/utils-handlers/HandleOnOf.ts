import { TypedHandler } from "../types";
import { HandleShot } from "./types";
import { equal } from "./utils";

export const HandleOneOfHandler: TypedHandler = ({ handle, current }, handleShots: HandleShot[] = []) => {
    const hshot = handleShots.find((hs) => equal(current(), hs.condition))

    if (!hshot) {
        throw new Error(`No one condition is matched`)
    }

    return handle(hshot.handler, ...hshot.args)
}