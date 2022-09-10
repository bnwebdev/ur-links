import { I18n } from "i18n-js/typings";
import { FC, ReactNode } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useModal } from "../../common/hooks/useModal";
import { useTranslate } from "../../../module-core/i18n-js";

import { DocumentType } from "../types";
import RootFactory from "../../../RootFactory";
import { TypeDescription } from "../../../RootFactory/types";

type Props = {
    documentType: DocumentType;
    handleRemove: (documentType: DocumentType) => void;
}

const printType = (i18n: I18n, description: TypeDescription): ReactNode => {
    return RootFactory.node(description.type)
        .toHumanName((type) => i18n.t(`document-types.types.${type}`), description)
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