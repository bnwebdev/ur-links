import { FC } from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useDexie, useLazyDexie } from "../../database";
import { useTranslate } from "../../i18n-js";
import { DocumentType } from "../types";
import DocumentTypeList from "./DocumentTypeList";

const DocumentTypes: FC = () => {
    const documentTypes = useDexie(db => db.documentTypes.toArray())
    const [handleRemove] = useLazyDexie<void, [DocumentType]>(
        (db, documentType) => db.documentTypes.delete(documentType.id as number)
    )
    const i18n = useTranslate()

    if (!documentTypes) {
        return <h1>{i18n.t('common.loading')}</h1>
    }

    return (<>
        {documentTypes.length 
            ? <DocumentTypeList {...{ documentTypes, handleRemove }} /> 
            : <h1>{i18n.t('common.nothing')}</h1>
        }
        <LinkContainer to="/document-types/create">
            <Button>{i18n.t('document-types.createLink')}</Button>
        </LinkContainer>
    </>)
}


export default DocumentTypes;