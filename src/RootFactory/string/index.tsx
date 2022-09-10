import { BaseNode } from "../BaseNode";
import { RootType } from "../types";

class StringNode extends BaseNode {
    type: RootType.STRING = RootType.STRING
    toHumanName: BaseNode['toHumanName'] = (translate, idescription) => {
        const { type } = this.checkType(idescription, this.type)

        return translate(type)
    }
}

export default new StringNode()