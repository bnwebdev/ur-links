import { ExpressionPrimitiveNull } from "../../../ast/expressions";
import { TypedHandler } from "../types";
import { Shot } from "./types";
import { equal } from "./utils";

export const ShotsHandler: TypedHandler = ({ next, current, expectCurrent }, shots: Shot[] = [], passed: Shot[] = [], needPostPass = true) => {
    for(const shot of shots) {
        while(passed.some(passedShot => equal(current(), passedShot))) {
          next()
        }

        if (typeof shot === 'string') {
            expectCurrent(shot)
            next()
        } else if (equal(current(), shot)) {
            next()
        } else {
            throw new Error(`Не подходящий тип!`)
        }
    }

    if (needPostPass) {
        while(passed.some(shot => equal(current(), shot))) {
          next()
        }
    }

    return new ExpressionPrimitiveNull()
}