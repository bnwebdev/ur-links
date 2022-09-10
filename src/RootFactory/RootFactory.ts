import { BaseNode } from "./BaseNode"
import { RootType } from "./types"

export class RootFactory {
    private static nodes: Map<RootType, BaseNode> | null = null
    public static get initialized () {
        return RootFactory.nodes !== null
    }

    public static initialize(...baseNodes: BaseNode[]) {
        RootFactory.nodes = new Map(baseNodes.map(node => [node.type, node]))
    }

    public static node(type: RootType): BaseNode {
        if (!RootFactory.nodes) {
            throw new Error(`Uninitialized factory`)
        } else if (!RootFactory.nodes.has(type)) {
            throw new Error(`Unexisted type ${type}`)
        }

        return RootFactory.nodes.get(type) as BaseNode
    }
}