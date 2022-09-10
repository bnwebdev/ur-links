import { FC, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { useDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import { DocumentType } from "../../../document-types";
import DocumentMakerForm from "./DocumentMakerForm";

const DocumentMaker: FC = () => {
    const i18n = useTranslate()
    const documentTypes = useDexie(db => db.documentTypes.toArray())
    
    const [selectedTypeId, setSelectedTypeId] = useState<DocumentType['id']>()

    const selectedDocumentType = useMemo(
        () => {
            if (selectedTypeId === undefined || !documentTypes) {
                return null
            }
            
            const candidate = documentTypes.find(({ id }) => id === selectedTypeId)

            return candidate || null
        },
        [selectedTypeId, documentTypes]
    )

    if (!documentTypes) {
        return <h2>{i18n.t('common.loading')}</h2>
    }

    if (!documentTypes.length) {
        return <>
            <h2>{i18n.t('documents.submodules.create.cantCreateDocument')}</h2>
            <h2>{i18n.t('documents.submodules.create.needOneDocumentTypeAtLeast')}</h2>
        </>
    }

    return (
    <>
        <Form.Select 
            value={selectedTypeId} 
            onChange={({ currentTarget: { value } }) => {
                setSelectedTypeId(value ? Number(value): undefined)
            }}
        >
            <option value=''>{i18n.t('documents.submodules.create.chooseType')}</option>
            {documentTypes.map(({ id, name }) => <option value={id} key={id}>{name}</option>)}
        </Form.Select>
        <br />
        {selectedDocumentType ? <DocumentMakerForm documentType={selectedDocumentType}/> : null}
    </>
    )
}

export default DocumentMaker