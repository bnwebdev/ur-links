import { useCallback, useState } from "react";
import { Button, Form, Spinner, Table } from "react-bootstrap";
import ReactJson from "react-json-view";
import { LinkContainer } from "react-router-bootstrap";
import { useDexie, useLazyDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";
import { delay, useLoading } from "../../common";

const ListLinks = () => {
  const documents = useDexie((db) => db.documents.toArray())
  const typeNames = useDexie(
    (db) => db.documentTypes.toArray()
      .then(
        arr => new Map(
          arr.map(({ id, name}) => ([ id, name ]))
        )
      )
  )
  
  const [removing, setRemoving] = useState(false)
  const [removingId, setRemovingId] = useState<number>()

  const [removeDocument] = useLazyDexie<unknown, [number | undefined]>(async (db, id) => {
    setRemovingId(id)
    try {
      await delay(1000)
      await db.documents.where('id').equals(id as number).delete()
    } catch (err) {
      throw err
    } finally {
      setRemovingId(undefined)
    }
  })
  const removeHandler = useLoading(removeDocument, setRemoving)

  const i18n = useTranslate()

  const [collapsedMeta, setCollapsedMeta] = useState(true)
  const filterHandler = useCallback(() => true, [])

  if (!documents || !typeNames) {
    return <h1>{i18n.t('common.loading')}</h1>
  }

  if (!documents.length) {
    return <h1>{i18n.t('common.nothing')}</h1>
  }

  const getIsIAmRemoving = (id: number | undefined) => removing && removingId === id

  return (
    <Table bordered striped>
      <thead className="table-dark">
        <tr>
          <th>{i18n.t('documents.table.id')}</th>
          <th>{i18n.t('documents.table.documentType')}</th>
          <th className="d-flex">
            {i18n.t('documents.table.meta')} (
              <Form.Group>
                <Form.Check
                  reverse
                  label={i18n.t('documents.table.collapsed')}
                  type="switch"
                  checked={collapsedMeta}
                  onChange={() => setCollapsedMeta(collapsed => !collapsed)}
                />
              </Form.Group>
            )
          </th>
          <th>{i18n.t('documents.table.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {documents.filter(filterHandler).map(({ id, type, meta }) => 
          <tr key={id}>
            <td>
              <LinkContainer to="/not-implemented">
                <a>#{id}</a>
              </LinkContainer>
            </td>
            <td>{typeNames.get(type)}</td>
            <td width={400}>
              <ReactJson
                collapsed={collapsedMeta}
                src={meta}
                name={false} 
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
              />
            </td>
            <td width={200}>
              <Button
                variant="danger"
                disabled={removing && removingId === id}
                onClick={() => removeHandler(id)}
                size="sm"
              >
                  { getIsIAmRemoving(id) && <Spinner animation="grow" size="sm" /> }
                  { getIsIAmRemoving(id) && i18n.t('documents.table.removingAction') }
                  { !getIsIAmRemoving(id) && i18n.t('documents.table.removeAction') }
              </Button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
};

export default ListLinks