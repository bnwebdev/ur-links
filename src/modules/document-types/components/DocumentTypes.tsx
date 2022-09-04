import { FC } from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const DocumentTypes: FC = () => {
    return <LinkContainer to="/document-types/create">
        <Nav.Link>Create</Nav.Link>
    </LinkContainer>
}


export default DocumentTypes;