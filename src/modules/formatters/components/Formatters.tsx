import { FC, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDexie, useLazyDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";
import { delay, useLoading } from "../../common";
import { useDocumentTypeNameById } from "../../document-types";

const Formatters: FC = () => {
    const i18n = useTranslate()
    const typeNames = useDocumentTypeNameById()
    const formatters = useDexie(db => db.formatters.toArray())

    const [removing, setRemoving] = useState(false)
    const [removingId, setRemovingId] = useState<number>()

    const [removeFormatter] = useLazyDexie<unknown, [number | undefined]>(async (db, id) => {
        setRemovingId(id)
        try {
        await delay(1000)
        await db.formatters.where('id').equals(id as number).delete()
        } catch (err) {
        throw err
        } finally {
        setRemovingId(undefined)
        }
    })
    const removeHandler = useLoading(removeFormatter, setRemoving)

    if (!typeNames || !formatters) {
        return <h1>{i18n.t('common.loading')}</h1>
    }

    if (!formatters.length) {
        return <h1>{i18n.t('common.nothing')}</h1>
    }

    const getIsIAmRemoving = (id: number | undefined) => removing && removingId === id

    return (<>
        <Table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Document Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {formatters.map(formatter =>
                    <tr key={formatter.id}>
                        <td>
                            <LinkContainer to={`/not-implemented`}>
                                <a>#{formatter.id}</a>
                            </LinkContainer>
                        </td>
                        <td>{formatter.name}</td>
                        <td>{typeNames.get(formatter.type) || 'Missed type'}</td>
                        <td width={200}>
                            <Button
                                variant="danger"
                                disabled={getIsIAmRemoving(formatter.id)}
                                onClick={() => removeHandler(formatter.id)}
                                size="sm"
                            >
                                { getIsIAmRemoving(formatter.id) && <Spinner animation="grow" size="sm" /> }
                                { getIsIAmRemoving(formatter.id) && i18n.t('documents.table.removingAction') }
                                { !getIsIAmRemoving(formatter.id) && i18n.t('documents.table.removeAction') }
                            </Button>
                        </td>
                    </tr>
                )} 
            </tbody>
        </Table>
    </>)
}

export default Formatters