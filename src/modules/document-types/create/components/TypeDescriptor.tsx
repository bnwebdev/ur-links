import { FC, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useTranslate } from "../../../i18n-js";

import { FieldDescription, FieldType } from "../../types";
import FieldTypeSelect from "./FieldTypeSelect";

type Props = {
    field: FieldDescription;
    handleChange: (updatedField: FieldDescription) => void;
    disabledTypeChanging?: boolean;
}
  
const TypeDescriptor: FC<Props> = ({ field, handleChange, disabledTypeChanging }) => {
    const [newFieldName, setNewFieldName] = useState('')
    const [show, setShow] = useState(false)
    const i18n = useTranslate()

    const closeModal = () => setShow(false)
    const openModal = () => {
        setNewFieldName('');
        setShow(true)
    }

    const handleAddField = (field: FieldDescription & { type: FieldType.OBJECT }) => () => {
        newFieldName.length && handleChange({
            ...field, 
            fieldTypes: {
                ...field.fieldTypes, 
                [newFieldName]: { type: FieldType.STRING }
            }
        })

        closeModal()
    }

    const changeTypeHandler = (type: FieldType) => {
        if (field.type === type) return;
        
        let newFieldDescription: FieldDescription; 
        
        if (type === FieldType.ARRAY) {
            newFieldDescription = { type, itemType: { type: FieldType.STRING } }
        } else if (type === FieldType.OBJECT) {
            newFieldDescription = { type, fieldTypes: {} }
        } else {
            newFieldDescription = { type };
        }

        handleChange(newFieldDescription)
    }

    switch (field.type) {
        case FieldType.STRING:
        case FieldType.NUMBER:
            return (
            <Container fluid>
                <FieldTypeSelect disabled={disabledTypeChanging} currentType={field.type} handleSelect={changeTypeHandler} />
            </Container>
            )
        case FieldType.ARRAY:
            return (
                <Container fluid>
                    <Row>
                        <Col xs={3}>
                            <FieldTypeSelect disabled={disabledTypeChanging} currentType={field.type} handleSelect={changeTypeHandler} />
                        </Col>
                        <Col>
                            <TypeDescriptor field={field.itemType} handleChange={
                                (newField) => handleChange({ ...field, itemType: newField })
                            } />
                        </Col>
                    </Row>
                </Container>
            )
        case FieldType.OBJECT:
            return (
                <Container className="border p-2">
                    <FieldTypeSelect disabled={disabledTypeChanging} currentType={field.type} handleSelect={changeTypeHandler} />
                    <div className="mb-2"/>
                    {Object.keys(field.fieldTypes).map(
                        (key) => (
                            <Container fluid key={key} className="mb-1 border-bottom pb-2 pt-1">
                                <Row>
                                    <Col xs={3} md={2} lg={1} className="d-flex justify-content-end align-items-center">
                                        {key}
                                    </Col>
                                    <Col>
                                        <TypeDescriptor field={field.fieldTypes[key]} handleChange={
                                            (newField) => handleChange({...field, fieldTypes: { ...field.fieldTypes, [key]: newField }})
                                        } />
                                    </Col>
                                    <Col xs={3} md={2} lg={1}>
                                        <Button variant="danger" size="sm"  onClick={
                                            () => {
                                                const fieldTypes = field.fieldTypes
                                                delete fieldTypes[key]
                                                handleChange({ 
                                                    ...field, 
                                                    fieldTypes
                                                })
                                            }
                                        }>
                                            {i18n.t('document-types.submodules.create.form.removeField')}
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        )
                    )}
                    <Modal show={show} onHide={closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                {i18n.t('document-types.submodules.create.addFieldModal.title')}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>
                                    {i18n.t('document-types.submodules.create.addFieldModal.fieldName')}
                                </Form.Label>
                                <Form.Control value={newFieldName} onChange={(e) => setNewFieldName(e.currentTarget.value)}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={handleAddField(field)}>
                                {i18n.t('document-types.submodules.create.addFieldModal.okText')}
                            </Button>
                            <Button variant="danger" onClick={closeModal}>
                                {i18n.t('document-types.submodules.create.addFieldModal.cancelText')}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Button variant="success" className="m-1" size="sm" onClick={openModal}>
                        {i18n.t('document-types.submodules.create.form.addField')}
                    </Button>
                </Container>
            )
        default: {
            throw new Error(`Undefiend field type`);
        }
    } 
};

export default TypeDescriptor;