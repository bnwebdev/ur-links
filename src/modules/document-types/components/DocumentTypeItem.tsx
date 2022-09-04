import { FC, ReactNode } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useModal } from "../../common/hooks/useModal";

import { DocumentType, FieldDescription, FieldType } from "../types";

type Props = {
    documentType: DocumentType;
    handleRemove: (documentType: DocumentType) => void;
}

const printType = (field: FieldDescription): ReactNode => {
    switch (field.type) {
        case FieldType.STRING:
        case FieldType.NUMBER:
            return field.type;
        case FieldType.ARRAY:
            return <>array{'<'}{printType(field.itemType)}{'>'}</>
        case FieldType.OBJECT:
            return <>
                {'{'}{
                    Object.entries(field.fieldTypes)
                    .map(([fieldName, fieldType]) => `"${fieldName}": ${printType(fieldType)}`)
                    .join(', ')
                }{'}'}
            </>
        default:
            throw new Error(`Undefined type`)
    }
}

const DocumentTypeItem: FC<Props> = ({ documentType, handleRemove }) => {
    const { name, fieldTypes } = documentType;

    const { show, open, close } = useModal();

    const onRemove = () => {
        handleRemove(documentType);
        close();
    }

    return (<>
        <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between">
                <Card.Title>{name}</Card.Title>
                <Button variant="danger" onClick={open}>Remove</Button>
            </Card.Header>
            <Card.Body>
                {Object.entries(fieldTypes).map(([fieldName, typeDescription]) => 
                <Row key={fieldName}>
                    <Col sm={3} md={2} lg={1}>{fieldName}</Col>
                    <Col>{printType(typeDescription)}</Col>
                </Row>
                )}
            </Card.Body>
        </Card>
        <Modal show={show} onHide={close}>
            <Modal.Header>
                <Modal.Title>Remove {name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                You would like to remove this type. Are you sure?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onRemove}>Yes</Button>
                <Button variant="secondary" onClick={close}>No</Button>
            </Modal.Footer>
        </Modal>
    </>)
};

export default DocumentTypeItem;