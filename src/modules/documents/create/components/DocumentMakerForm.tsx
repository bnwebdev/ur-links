import { FC, useEffect, useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useLazyDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import { ArrayTypeDescription, RootType, TypeDescription } from "../../../../RootFactory/types";
import { DocumentType, useValidationSchema } from "../../../document-types";
import { Document } from "../../types";

type TypeDescriptionProps<T extends any = any> = {
    typeDescription: TypeDescription
    handleChange: (value: T) => void
    value: T
}

const TypeDescriptionInput: FC<TypeDescriptionProps> = (props) => {
    const { typeDescription, handleChange } = props
    let { value } = props

    const i18n = useTranslate()
    const onAddArrayItem = () => {
        const item = (typeDescription as ArrayTypeDescription).itemType 
        if (!(value instanceof Array)) {
            value = []
        }
        let newItem
        switch (item.type) {
            case RootType.NUMBER:
                newItem = 0
                break
            case RootType.STRING:
                newItem = ''
                break
            case RootType.ARRAY:
                newItem = []
                break
            case RootType.OBJECT:
                newItem = {}
                break
        }

        handleChange([...value, newItem])
    }
    
    switch (typeDescription.type) {
        case RootType.STRING:
            return (
                <Form.Group>
                    <Form.Control
                        value={value} 
                        onChange={({ currentTarget: { value } }) => handleChange(value)}
                    />
                </Form.Group>
            )
        case RootType.NUMBER:
            return (
                <Form.Group>
                    <Form.Control
                        type="number"
                        value={value}
                        onChange={({ currentTarget: { value } }) => handleChange(value !== '' ? Number(value): value )}
                    />
                </Form.Group>
            )
        case RootType.ARRAY:
            if (!(value instanceof Array)) {
                value = []
            }
            return (
                <Form.Group>
                    {(value as Array<any>).map(
                        (item, idx) =>(
                            <TypeDescriptionInput
                                key={typeDescription.type + idx}
                                value={item}
                                handleChange={(newValue) => {
                                    const copy = [...value]
                                    copy[idx] = newValue
                                    handleChange(copy)
                                }}
                                typeDescription={typeDescription.itemType}
                            />)
                        )
                    }
                    <Button variant="success" size="sm" onClick={onAddArrayItem} >+</Button>
                </Form.Group>
            )
        case RootType.OBJECT:
            if (value === null || typeof value !== 'object') {
                value = Object.fromEntries(
                    Object.entries(typeDescription.fieldTypes)
                        .map(([key]) => [key])
                )
            }
            return (<>
            <Table bordered hover className="m-0">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">{i18n.t('documents.submodules.create.objectTable.fieldName')}</th>
                        <th scope="col">{i18n.t('documents.submodules.create.objectTable.fieldValue')}</th>
                    </tr>
                </thead>
                <tbody>
                {Object.entries(typeDescription.fieldTypes).map(
                    ([ typeName, typeDescription]) =>
                    <tr key={typeName}>
                        <th scope="row">{typeName}</th>
                        <td className={typeDescription.type === RootType.OBJECT ? "p-0" : ""}>
                            <TypeDescriptionInput 
                                typeDescription={typeDescription}
                                handleChange={(newValue) => {
                                    const copy = { ...value }
                                    copy[typeName] = newValue
                                    handleChange(copy)
                                } }
                                value={value[typeName]}
                                key={typeName} 
                            />
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
            </>
            )
        default:
            throw new Error(`Undefined type`)
    }
}

type Props = {
    documentType: DocumentType
}


const DocumentMakerForm: FC<Props> = ({ documentType }) => {
    const i18n = useTranslate()

    const typeDescription: TypeDescription = useMemo(() => ({
        type: RootType.OBJECT,
        fieldTypes: documentType.fieldTypes
    }), [documentType])
    const [saveDocument] = useLazyDexie<unknown, [Document]>((db, document) => db.documents.add(document))
    const validationSchema = useValidationSchema(typeDescription)

    const [document, setDocument] = useState<Document>({} as Document)
    const [error, setError] = useState('')

    useEffect(() => {
        setDocument({} as Document)
    }, [documentType])

    const handleSubmit = async () => {
        try {
            setError('')
            await validationSchema.validateAsync(document)
            await saveDocument({
                meta: document,
                type: documentType.id,
            })
            setDocument({})
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return <Form onSubmit={handleSubmit}>
        <TypeDescriptionInput
            typeDescription={typeDescription}
            value={document}
            handleChange={setDocument}
        />
        <br />
        { error ? <h3 className="text-danger">{error}</h3>: null}
        <Button variant="success" type="submit">
            {i18n.t('documents.submodules.create.saveDocument')}
        </Button>  
    </Form>
}

export default DocumentMakerForm