import { FC } from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";

const WorkAreas: FC = () => {
    const i18n = useTranslate()

    const workAreas = useDexie(db => db.workAreas.toArray())

    const CreateAreaButton: FC = () => (
        <LinkContainer to={'/work-areas/create'}>
            <Button variant="success">{i18n.t('work-areas.createArea')}</Button>
        </LinkContainer>
    )

    if (!workAreas) {
        return <h1>{i18n.t('common.loading')}</h1>
    }

    if (!workAreas.length) {
        return (
            <Row>
                <Col xs={6} className="d-flex justify-content-end border-end border-dark">
                    <h1>{i18n.t('common.nothing')}</h1>
                </Col>
                <Col xs={6} className="d-flex align-items-center">
                    <CreateAreaButton />
                </Col>
            </Row>
        )
    }

    return <>
        <Row>
            <Col xs={6} className="d-flex justify-content-end border-end border-dark">
                <h1>{i18n.t('work-areas.header')}</h1>
            </Col>
            <Col xs={6} className="d-flex align-items-center">
                <CreateAreaButton />
            </Col>
        </Row>
        <ListGroup>
            {workAreas.map((area) => (
                <ListGroup.Item key={area.id}>
                    {area.label}@{area.id}
                </ListGroup.Item>
            ))}
        </ListGroup>
    </>
}

export default WorkAreas