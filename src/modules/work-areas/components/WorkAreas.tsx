import { FC, useCallback, useState } from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDexie, useLazyDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";
import { useLoading, useModal } from "../../common";
import { WorkArea } from "../types";
import WorkAreaMakerModal from "./WorkAreaMakerModal";

const WorkAreas: FC = () => {
    const i18n = useTranslate()
    const workAreas = useDexie(db => db.workAreas.toArray())

    const {close, open, show} = useModal()
    const [saving, setSaving] = useState(false)
    const [saveWorkArea] = useLazyDexie<unknown, [WorkArea]>((db, workArea) => db.workAreas.add(workArea))

    const createHandler = useCallback(async ({ label }: { label: string }) => {
        await saveWorkArea({ label, documentIds: [], formatterIds: [] })
        close()
    }, [saveWorkArea, close])
    const createHandlerWithLoading = useLoading(createHandler, setSaving)

    if (!workAreas) {
        return <h1>{i18n.t('common.loading')}</h1>
    }

    return <>
        <Row>
            <Col xs={6} className="d-flex justify-content-end border-end border-dark">
                {!!workAreas.length && <h1>{i18n.t('work-areas.header')}</h1>}
                {!workAreas.length && <h1>{i18n.t('common.nothing')}</h1>}
            </Col>
            <Col xs={6} className="d-flex align-items-center">
                <Button variant="success" onClick={open}>{i18n.t('work-areas.createArea')}</Button>
                <WorkAreaMakerModal show={show} handleClose={close} loading={saving} handleSave={createHandlerWithLoading} />
            </Col>
        </Row>
        <br />
        <ListGroup>
            {workAreas.map((area) => (
                <LinkContainer to={`/work-areas/${area.id}`} key={area.id}>
                    <ListGroup.Item key={area.id} action>
                        {area.label}@{area.id}
                    </ListGroup.Item>
                </LinkContainer>
            ))}
        </ListGroup>
    </>
}

export default WorkAreas