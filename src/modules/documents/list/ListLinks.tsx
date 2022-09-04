import { useDexie } from "../../database";

const ListLinks = () => {
  
  const documents = useDexie((db) => db.documents.toArray())

  if (!documents) {
    return <h1>Loading</h1>
  }

  return documents.length
    ? <>{documents.map(({id, title}) => <h1 key={id}>{title}</h1>)}</>
    : <h1>Nothing</h1>
};

export default ListLinks