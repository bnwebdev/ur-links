import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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

  if (!documents || !typeNames) {
    return <h1>{i18n.t('common.loading')}</h1>
  }

  return documents.length ? 
    <ListGroup defaultActiveKey="#link1">
      {documents.map(
        ({ id, type }) => 
          <LinkContainer key={id} to={`/not-implemented`}>
            <ListGroup.Item action>
              Document with id #{id} and with type {typeNames.get(type)}
            </ListGroup.Item>
          </LinkContainer>
      )}
    </ListGroup>
    : <h1>{i18n.t('common.nothing')}</h1>
};

export default ListLinks