import { useDexie } from "../../database";
import { useTranslate } from "../../i18n-js";

const ListLinks = () => {
  const documents = useDexie((db) => db.documents.toArray())
  const i18n = useTranslate()

  if (!documents) {
    return <h1>{i18n.t('common.loading')}</h1>
  }

  return documents.length
    ? <>{documents.map(({id, title}) => <h1 key={id}>{title}</h1>)}</>
    : <h1>{i18n.t('common.nothing')}</h1>
};

export default ListLinks