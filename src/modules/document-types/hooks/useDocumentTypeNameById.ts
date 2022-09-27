import { useDexie } from "../../../module-core/database"

export const useDocumentTypeNameById = () => {
  return useDexie(
    (db) => db.documentTypes.toArray()
      .then(
        arr => new Map(
          arr.map(({ id, name}) => ([ id, name ]))
        )
      )
  )
}