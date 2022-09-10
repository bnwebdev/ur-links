import { FC } from "react";
import { Form } from "react-bootstrap";
import { useTranslate } from "../../../../module-core/i18n-js";
import { RootType } from "../../../../RootFactory/types";

type Props = { 
    disabled?: boolean; 
    currentType: RootType; 
    handleSelect: (newType: RootType) => void 
}

const TypeSelect: FC<Props> = ({ currentType, handleSelect, disabled }) => {
    const i18n = useTranslate()

    return (
        <Form.Select disabled={disabled} size="sm" value={currentType} onChange={(e) => handleSelect(e.currentTarget.value as RootType)}>
            {Object.values(RootType).map(type => (
                <option key={type} value={type}>
                    {i18n.t(`document-types.types.${type}`)}
                </option>
            ))}
        </Form.Select>
    )
}

export default TypeSelect;