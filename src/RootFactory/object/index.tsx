import { BaseNode } from "../BaseNode";
import { RootType } from "../types";

class ObjectNode extends BaseNode {
    type: RootType.OBJECT = RootType.OBJECT
    toHumanName: BaseNode['toHumanName'] = (translate, idescription) => {
        const description = this.checkType(idescription, this.type)
        const humanNames: Array<[string, string]> = Object.entries(description.fieldTypes)
                .map(([key, type]) => {
                    const humanName = this.RootFactory.node(type.type)
                        .toHumanName(translate, type)

                    return [key, humanName]
                })
        const humanNameTypes = humanNames.map(([key, value]) => `"${key}": ${value}`)

        return `${translate(description.type)}{ ${humanNameTypes.join(', ')} }`
    }
}

export default new ObjectNode()