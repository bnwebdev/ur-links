import { I18n } from "i18n-js/typings";
import { FC, ReactNode } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useModal } from "../../common/hooks/useModal";
import { useTranslate } from "../../i18n-js";

import { DocumentType, FieldDescription, FieldType } from "../types";

type Props = {
    documentType: DocumentType;
    handleRemove: (documentType: DocumentType) => void;
}

const printType = (i18n: I18n, field: FieldDescription): ReactNode => {
    const formattedType = i18n.t(`document-types.types.${field.type}`);

    switch (field.type) {
        case FieldType.STRING:
        case FieldType.NUMBER:
            return formattedType;
        case FieldType.ARRAY:
            return <>{formattedType}{'<'}{printType(i18n, field.itemType)}{'>'}</>
        case FieldType.OBJECT:
            return <>
                {'{'}{
                    Object.entries(field.fieldTypes)
                    .map(([fieldName, fieldType]) => `"${fieldName}": ${printType(i18n, fieldType)}`)
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
    const i18n = useTranslate()

    const onRemove = () => {
        handleRemove(documentType);
        close();
    }

    return (<>
        <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between">
                <Card.Title>{name}</Card.Title>
                <Button variant="danger" onClick={open}>{i18n.t('document-types.removeType')}</Button>
            </Card.Header>
            <Card.Body>
                {Object.entries(fieldTypes).map(([fieldName, typeDescription]) => 
                <Row key={fieldName}>
                    <Col sm={3} md={2} lg={1}>{fieldName}</Col>
                    <Col>{printType(i18n, typeDescription)}</Col>
                </Row>
                )}
            </Card.Body>
        </Card>
        <Modal show={show} onHide={close}>
            <Modal.Header>
                <Modal.Title>{i18n.t('document-types.removeModal.title', { name })}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {i18n.t('document-types.removeModal.question')}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onRemove}>
                    {i18n.t('document-types.removeModal.okText')}
                </Button>
                <Button variant="secondary" onClick={close}>
                    {i18n.t('document-types.removeModal.cancelText')}
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
};

export default DocumentTypeItem;