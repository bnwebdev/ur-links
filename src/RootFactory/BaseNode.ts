import { RootFactory } from "./RootFactory"
import {
    ArrayTypeDescription,
    NumberTypeDescription,
    ObjectTypeDescription,
    RootType,
    StringTypeDescription,
    TypeDescription
} from "./types"

export abstract class BaseNode {
    abstract type: RootType
    abstract toHumanName: (translateTypeName: (type: RootType) => string, description: TypeDescription) => string

    protected RootFactory = RootFactory

    public checkType<
        FT extends RootType, 
        FD extends TypeDescription = 
            FT extends RootType.ARRAY 
            ? ArrayTypeDescription
            : FT extends RootType.NUMBER
            ? NumberTypeDescription
            : FT extends RootType.OBJECT
            ? ObjectTypeDescription
            : StringTypeDescription
    >(description: TypeDescription, type: FT): FD {
        if (description.type !== type) {
            throw new Error(`Wrong type. ${description.type} !== ${type}`)
        }

        return description as FD
    }
}

