import { FC } from "react";
import { Container, ListGroup, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "../../../module-core/i18n-js";

const Error404: FC = () => {
  const navigate = useNavigate()
  const i18n = useTranslate()

  return <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
    <div>
        <h1 className="text-danger">{i18n.t('handlerPages.error404.errorName')}</h1>
        <p>{i18n.t('handlerPages.error404.info')}</p>
        <ListGroup horizontal>
            <LinkContainer to="/">
                <ListGroup.Item action>
                    {i18n.t('handlerPages.error404.backToHome')}
                </ListGroup.Item>
            </LinkContainer>
            <ListGroup.Item action>
                <Nav.Link onClick={() => navigate(-1)}>{i18n.t('handlerPages.error404.back')}</Nav.Link>
            </ListGroup.Item>
        </ListGroup>
    </div>
  </Container>
}

export default Error404;