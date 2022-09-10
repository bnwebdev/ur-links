import { IndexableType } from "dexie";
import { FC, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLazyDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import { ObjectTypeDescription, RootType } from "../../../../RootFactory/types";

import { DocumentType } from "../../types";
import TypeDescriptor from "./TypeDescriptor";

const CreateDocumentType: FC = () => {
    const i18n = useTranslate()

    const { register, handleSubmit, reset } = useForm<{ name: string }>()
    const [fields, setFields] = useState<ObjectTypeDescription>({ type: RootType.OBJECT, fieldTypes: {} })
    
    const [addDocType] = useLazyDexie<IndexableType, [DocumentType]>((db, docType) => db.documentTypes.add(docType))

    const handleCreateNewType = async ({ name }: { name: string }) => {
        await addDocType({
            name,
            fieldTypes: fields.fieldTypes
        })
        setFields({ type: RootType.OBJECT, fieldTypes: {} })
        reset({ name: '' })
    }

    return ( 
        <Form onSubmit={handleSubmit(handleCreateNewType)}>
            <Form.Group className="mb-3">
                <Form.Label>{i18n.t('document-types.submodules.create.form.name')}</Form.Label>
                <Form.Control {...register('name')}/>
            </Form.Group>
            <h2>{i18n.t('document-types.submodules.create.form.fieldsInDocument')}</h2>
            <TypeDescriptor disabledTypeChanging field={fields} handleChange={setFields as any} />
            <Button type="submit" className="mt-2">
                {i18n.t('document-types.submodules.create.form.submit')}
            </Button>
        </Form>
    )
}

export default CreateDocumentType;