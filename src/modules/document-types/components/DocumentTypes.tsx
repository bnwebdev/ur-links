import { FC } from "react";

import { useDexie, useLazyDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";
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
    </>)
}


export default DocumentTypes;