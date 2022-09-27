import { FC } from "react";
import { Table } from "react-bootstrap";
import { useDexie } from "../../../module-core/database";
import { useTranslate } from "../../../module-core/i18n-js";
import { useDocumentTypeNameById } from "../../document-types";

const Formatters: FC = () => {
    const i18n = useTranslate()
    const typeNames = useDocumentTypeNameById()
    const formatters = useDexie(db => db.formatters.toArray())

    if (!typeNames || !formatters) {
        return <h1>{i18n.t('common.loading')}</h1>
    }

    if (!formatters.length) {
        return <h1>{i18n.t('common.nothing')}</h1>
    }

    return (<>
        <Table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Document Type</th>
                </tr>
            </thead>
            <tbody>
                {formatters.map(formatter =>
                    <tr key={formatter.id}>
                        <td>{formatter.id}</td>
                        <td>{formatter.name}</td>
                        <td>{typeNames.get(formatter.type) || 'Missed type'}</td>
                    </tr>
                )} 
            </tbody>
        </Table>
    </>)
}

export default Formatters