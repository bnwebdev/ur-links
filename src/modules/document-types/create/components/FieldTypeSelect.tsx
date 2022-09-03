import { FC } from "react";
import { Form } from "react-bootstrap";

import { FieldType } from "../../types";

type Props = { 
    disabled?: boolean; 
    currentType: FieldType; 
    handleSelect: (newType: FieldType) => void 
}

const FieldTypeSelect: FC<Props> = ({ currentType, handleSelect, disabled }) => (
    <Form.Select disabled={disabled} size="sm" value={currentType} onChange={(e) => handleSelect(e.currentTarget.value as FieldType)}>
        {Object.values(FieldType).map(type => <option key={type} value={type}>{type}</option>)}
    </Form.Select>
)

export default FieldTypeSelect;