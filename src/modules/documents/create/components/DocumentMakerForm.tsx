import { FC, FormEventHandler, useCallback, useMemo, useState } from "react";
import { Button, Form, Spinner, Table } from "react-bootstrap";
import { useLazyDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import {
    ArrayTypeDescription,
    NumberTypeDescription,
    ObjectTypeDescription,
    RootType,
    StringTypeDescription,
    TypeDescription
} from "../../../../RootFactory/types";
import { delay, useLoading, useWithoutInitialEffect } from "../../../common";
import { DocumentType, useValidationSchema } from "../../../document-types";
import { Document } from "../../types";

const getInitialValue = (description: TypeDescription): any => {
   const { type } = description
   switch (type) {
        case RootType.NUMBER:
        case RootType.STRING:
            return undefined
        case RootType.ARRAY:
            return []
        case RootType.OBJECT:
            return Object.fromEntries(
                Object.entries(description.fieldTypes)
                    .map(([key, type]) => [key, getInitialValue(type) as any])
            )
   } 
}

type ChangeHandler<T> = (value: T) => void

interface TypeDescriptionProps<T extends any = any> {
    typeDescription: TypeDescription
    handleChange: ChangeHandler<T>
    value: T
}

// ================================= STRING =================================
interface StringInputProps extends TypeDescriptionProps<string | undefined> {
    typeDescription: StringTypeDescription
}

const StringInput: FC<StringInputProps> = ({ handleChange, value }) => (
    <Form.Group>
        <Form.Control
            value={value || ''} 
            onChange={({ currentTarget: { value } }) => handleChange(value)}
        />
    </Form.Group>
)

// ================================= NUMBER =================================
interface NumberInputProps extends TypeDescriptionProps<number | undefined> {
    typeDescription: NumberTypeDescription
}

const NumberInput: FC<NumberInputProps> = ({ handleChange, value }) => (
    <Form.Group>
        <Form.Control
            type="number"
            value={value || ''}
            onChange={({ currentTarget: { value } }) => handleChange(value !== '' ? Number(value): undefined )}
        />
    </Form.Group>
)

// ================================= ARRAY =================================
interface ArrayInputProps extends TypeDescriptionProps<any[]> {
    typeDescription: ArrayTypeDescription
}

const ArrayInput: FC<ArrayInputProps> = ({ handleChange, typeDescription, value: array }) => {

    const changeHandlers = useMemo(() => array.map((_, idx) => 
        (newValue: any) => {
            const copy = [...array]
            copy[idx] = newValue
            handleChange(copy)
        }),
        [array, handleChange]
    )

    return <Form.Group>
        {(array).map((item, idx) =>(
                <TypeDescriptionInput
                    key={typeDescription.type + idx}
                    handleChange={changeHandlers[idx]}
                    typeDescription={typeDescription.itemType}
                    value={item}
                />)
            )
        }
        <Button variant="success" size="sm" onClick={() => handleChange([...array, getInitialValue(typeDescription.itemType)])} >+</Button>
    </Form.Group>
}

// ================================= OBJECT =================================
interface ObjectInputProps extends TypeDescriptionProps<Record<string, any>> {
    typeDescription: ObjectTypeDescription
}

const ObjectInput: FC<ObjectInputProps> = ({ handleChange, typeDescription, value: object }) => {
    const i18n = useTranslate()

    const changeHandlers = useMemo(() => {
        return Object.fromEntries(
            Object.keys(typeDescription.fieldTypes)
                .map((typeName) => {
                    return [typeName, (newValue: any) => {
                        const copy = { ...object }
                        copy[typeName] = newValue
                        handleChange(copy)
                    }]
                })
        )
    }, [object, typeDescription.fieldTypes, handleChange])

    return <Table bordered hover className="m-0">
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
                        handleChange={changeHandlers[typeName]}
                        value={object[typeName]}
                    />
                </td>
            </tr>
        )}
        </tbody>
    </Table>
}

// ================================= COMBINED =================================
const TypeDescriptionInput: FC<TypeDescriptionProps> = (props) => {
    const { typeDescription, handleChange, value } = props

    switch (typeDescription.type) {
        case RootType.STRING:
            return <StringInput value={value} handleChange={handleChange} typeDescription={typeDescription} />
        case RootType.NUMBER:
            return <NumberInput value={value} handleChange={handleChange} typeDescription={typeDescription} />
        case RootType.ARRAY:
            return <ArrayInput value={value} handleChange={handleChange} typeDescription={typeDescription} />
        case RootType.OBJECT:
            return <ObjectInput value={value} handleChange={handleChange} typeDescription={typeDescription} />
        default:
            throw new Error(`Undefined type`)
    }
}

type Props = {
    documentType: DocumentType
}


// ================================= FORM =================================
const DocumentMakerForm: FC<Props> = ({ documentType }) => {
    const i18n = useTranslate()

    const typeDescription: TypeDescription = useMemo(() => ({
        type: RootType.OBJECT,
        fieldTypes: documentType.fieldTypes
    }), [documentType])

    const [saveDocument] = useLazyDexie<unknown, [Document]>((db, document) => db.documents.add(document))
    const validationSchema = useValidationSchema(typeDescription)

    const [document, setDocument] = useState<Document>(() => getInitialValue(typeDescription))
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useWithoutInitialEffect(() => {
        setDocument(getInitialValue(typeDescription))
    }, [typeDescription])

    const handleSubmitFn: FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
        e.preventDefault()

        try {
            setError('')
            await validationSchema.validateAsync(document)
            await delay(500)
            await saveDocument({
                meta: document,
                type: documentType.id,
            })
            setDocument(getInitialValue(typeDescription))
        } catch (err) {
            setError((err as Error).message)
        }
    }, [document, documentType, saveDocument, validationSchema, typeDescription])

    const handleSubmit = useLoading(handleSubmitFn, setLoading)

    return <>
        <Form onSubmit={handleSubmit}>
            <TypeDescriptionInput
                typeDescription={typeDescription}
                handleChange={setDocument}
                value={document}
                />
            <br />
            { error ? <h3 className="text-danger">{error}</h3>: null}
            <Button variant="success" type="submit" disabled={loading}>
                {!loading && i18n.t('documents.submodules.create.saveDocument')}
                {loading && <Spinner animation="border" size="sm" as="span"/>}
                {loading && ' Loading'}
            </Button>  
        </Form>
    </>
}

export default DocumentMakerForm