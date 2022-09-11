import { useCallback, useState } from "react";
import { Form, Table } from "react-bootstrap";
import ReactJson from "react-json-view";
import { useDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";

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

  const i18n = useTranslate()

  const [collapsedMeta, setCollapsedMeta] = useState(true)
  const filterHandler = useCallback(() => true, [])

  if (!documents || !typeNames) {
    return <h1>{i18n.t('common.loading')}</h1>
  }

  if (!documents.length) {
    return <h1>{i18n.t('common.nothing')}</h1>
  }


  return (
    <Table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Document Type</th>
          <th className="d-flex">
            Meta (
              <Form.Group>
                <Form.Check
                  reverse
                  label="collapsed"
                  type="switch"
                  checked={collapsedMeta}
                  onChange={() => setCollapsedMeta(collapsed => !collapsed)}
                />
              </Form.Group>
            )
          </th>
        </tr>
      </thead>
      <tbody>
        {documents.filter(filterHandler).map(({ id, type, meta }) => 
          <tr>
            <td>#{id}</td>
            <td>{typeNames.get(type)}</td>
            <td>
              <ReactJson
                collapsed={collapsedMeta}
                src={meta}
                name={false} 
                enableClipboard={false} 
                style={{ width: 300 }}
                displayDataTypes={false}
                displayObjectSize={false}
              /></td>
          </tr>
        )}
      </tbody>
    </Table>
  )
};

export default ListLinks