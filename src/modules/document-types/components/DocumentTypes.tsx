import { FC } from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDexie, useLazyDexie } from "../../database";
import { DocumentType } from "../types";
import DocumentTypeList from "./DocumentTypeList";

const DocumentTypes: FC = () => {
    const documentTypes = useDexie(db => db.documentTypes.toArray())
    const [handleRemove] = useLazyDexie<void, [DocumentType]>(
        (db, documentType) => db.documentTypes.delete(documentType.id as number)
    )

    if (!documentTypes) {
        return <h1>Loading data</h1>
    }

    return (<>
        {documentTypes.length 
            ? <DocumentTypeList {...{ documentTypes, handleRemove }} /> 
            : <h1>Nothing!</h1>
        }
        <LinkContainer to="/document-types/create">
            <Button>Create</Button>
        </LinkContainer>
    </>)
}


export default DocumentTypes;