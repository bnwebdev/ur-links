import { FC } from "react";
import { DocumentType } from "../types";
import DocumentTypeItem from "./DocumentTypeItem";

type Props = {
    documentTypes: DocumentType[]
    handleRemove: (documentType: DocumentType) => void
}

const DocumentTypeList: FC<Props> = ({ documentTypes, handleRemove }) => (
    <>
        {documentTypes.map((documentType, idx) => 
            <DocumentTypeItem 
                key={documentType.id === undefined ? idx : documentType.id} 
                documentType={documentType}
                handleRemove={handleRemove}
            />
        )}
    </>
);

export default DocumentTypeList;