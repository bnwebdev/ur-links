import { BaseNode } from "../BaseNode";
import { RootType } from "../types";

class NumberNode extends BaseNode {
    type: RootType.NUMBER = RootType.NUMBER
    toHumanName: BaseNode['toHumanName'] = (translate, idescription) => {
        const { type } = this.checkType(idescription, this.type)

        return translate(type)
    }
}

export default new NumberNode()