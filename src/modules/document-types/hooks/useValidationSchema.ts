import * as Joi from "joi";
import { useMemo } from "react";
import { RootType, TypeDescription } from "../../../RootFactory/types";

const getValidationSchema = <T = any>(description: TypeDescription): Joi.Schema<T> => {
    switch (description.type) {
        case RootType.ARRAY:
            return Joi.array().items(getValidationSchema(description.itemType))
        case RootType.OBJECT:
            return Joi.object(
                Object.fromEntries(
                    Object.entries(description.fieldTypes)
                        .map(([key, type]) => [key, getValidationSchema(type)])
                )
            )
        case RootType.NUMBER:
            return Joi.number()
        case RootType.STRING:
            return Joi.string()
    }
}

export const useValidationSchema = <T = any>(description: TypeDescription) => {
    return useMemo(() => getValidationSchema<T>(description), [description])
}