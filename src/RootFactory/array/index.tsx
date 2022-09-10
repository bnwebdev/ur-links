import { BaseNode } from "../BaseNode";
import { RootType } from "../types";

class ArrayNode extends BaseNode {
    type: RootType.ARRAY = RootType.ARRAY
    toHumanName: BaseNode['toHumanName'] = (translate, idescription) => {
        const description = this.checkType(idescription, this.type)
        const item = this.RootFactory.node(description.itemType.type)

        return `${translate(description.type)}<${item.toHumanName(translate, description.itemType)}>`
    }
}

export default new ArrayNode()