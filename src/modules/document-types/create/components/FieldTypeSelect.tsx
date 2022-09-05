import { FC } from "react";
import { Form } from "react-bootstrap";
import { useTranslate } from "../../../i18n-js";

import { FieldType } from "../../types";

type Props = { 
    disabled?: boolean; 
    currentType: FieldType; 
    handleSelect: (newType: FieldType) => void 
}

const FieldTypeSelect: FC<Props> = ({ currentType, handleSelect, disabled }) => {
    const i18n = useTranslate()

    return (
        <Form.Select disabled={disabled} size="sm" value={currentType} onChange={(e) => handleSelect(e.currentTarget.value as FieldType)}>
            {Object.values(FieldType).map(type => (
                <option key={type} value={type}>
                    {i18n.t(`document-types.types.${type}`)}
                </option>
            ))}
        </Form.Select>
    )
}

export default FieldTypeSelect;