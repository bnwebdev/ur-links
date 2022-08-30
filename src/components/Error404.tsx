import { FC } from "react";
import { Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Error404: FC = () => (
  <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
    <div>
        <h1 className="text-danger">Error 404</h1>
        <p>Page is not found</p>
        <LinkContainer to="/">
            <Nav.Link>Back to Home</Nav.Link>
        </LinkContainer>
    </div>
  </Container>
)

export default Error404;