import { IndexableType } from "dexie";
import { FC, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLazyDexie } from "../../../database";

import { DocumentType, FieldType, ObjectFieldDescription } from "../../types";
import TypeDescriptor from "./TypeDescriptor";

const CreateDocumentType: FC = () => {
    const { register, handleSubmit, reset } = useForm<{ name: string }>()
    const [fields, setFields] = useState<ObjectFieldDescription>({ type: FieldType.OBJECT, fieldTypes: {} })
    
    const [addDocType] = useLazyDexie<IndexableType, [DocumentType]>((db, docType) => db.documentTypes.add(docType))

    const handleCreateNewType = async ({ name }: { name: string }) => {
        await addDocType({
            name,
            fieldTypes: fields.fieldTypes
        })
        setFields({ type: FieldType.OBJECT, fieldTypes: {} })
        reset({ name: '' })
    }

    return ( 
        <Form onSubmit={handleSubmit(handleCreateNewType)}>
            <Form.Group className="mb-3">
                <Form.Label>Document type name</Form.Label>
                <Form.Control {...register('name')}/>
            </Form.Group>
            <h2>Fields in document</h2>
            <TypeDescriptor disabledTypeChanging field={fields} handleChange={setFields as any} />
            <Button type="submit" className="mt-2">Create New Type</Button>

        </Form>
    )
}

export default CreateDocumentType;