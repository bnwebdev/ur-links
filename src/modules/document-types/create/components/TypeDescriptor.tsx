import { FC, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useTranslate } from "../../../../module-core/i18n-js";
import { RootType, TypeDescription } from "../../../../RootFactory/types";

import TypeSelect from "./TypeSelect";

type Props = {
    field: TypeDescription;
    handleChange: (updatedField: TypeDescription) => void;
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

    const handleAddField = (field: TypeDescription & { type: RootType.OBJECT }) => () => {
        newFieldName.length && handleChange({
            ...field, 
            fieldTypes: {
                ...field.fieldTypes, 
                [newFieldName]: { type: RootType.STRING }
            }
        })

        closeModal()
    }

    const changeTypeHandler = (type: RootType) => {
        if (field.type === type) return;
        
        let newTypeDescription: TypeDescription; 
        
        if (type === RootType.ARRAY) {
            newTypeDescription = { type, itemType: { type: RootType.STRING } }
        } else if (type === RootType.OBJECT) {
            newTypeDescription = { type, fieldTypes: {} }
        } else {
            newTypeDescription = { type };
        }

        handleChange(newTypeDescription)
    }

    switch (field.type) {
        case RootType.STRING:
        case RootType.NUMBER:
            return (
            <Container fluid>
                <TypeSelect disabled={disabledTypeChanging} currentType={field.type} handleSelect={changeTypeHandler} />
            </Container>
            )
        case RootType.ARRAY:
            return (
                <Container fluid>
                    <Row>
                        <Col xs={3}>
                            <TypeSelect disabled={disabledTypeChanging} currentType={field.type} handleSelect={changeTypeHandler} />
                        </Col>
                        <Col>
                            <TypeDescriptor field={field.itemType} handleChange={
                                (newField) => handleChange({ ...field, itemType: newField })
                            } />
                        </Col>
                    </Row>
                </Container>
            )
        case RootType.OBJECT:
            return (
                <Container className="border p-2">
                    <TypeSelect disabled={disabledTypeChanging} currentType={field.type} handleSelect={changeTypeHandler} />
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