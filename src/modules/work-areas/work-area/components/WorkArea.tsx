import { FC, useMemo } from "react";
import { useDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import { buildAst, formatDocument, prepareRuntimeContextWithFormatter } from "../../../formatters/utils";

import { useParamId } from "../hooks";

const WorkArea: FC = () => {
    const workAreaId = useParamId()
    const i18n = useTranslate()

    const workArea = useDexie(db => db.workAreas.where({ id: workAreaId }).first(), [workAreaId], null)
    const workAreaFormatters = useDexie(db => db.workAreaFormatter.where({ workAreaId }).toArray(), [workAreaId])
    const workAreaDocuments = useDexie(db => db.workAreaDocument.where({ workAreaId }).toArray(), [workAreaId])

    const formatters = useDexie(async (db) => {
        if (!workAreaFormatters) {
            return []
        }

        return db.formatters.where('id').anyOf(workAreaFormatters.map(({ formatterId }) => formatterId)).toArray()
    }, [workAreaFormatters])

    const documents = useDexie(async (db) => {
        if (!workAreaDocuments) {
            return []
        }

        return db.documents.where('id').anyOf(workAreaDocuments.map(({ documentId }) => documentId)).toArray()
    }, [workAreaDocuments])

    const formatterContextByFormatterId = useMemo(
        () => formatters && Object.fromEntries(formatters.map((formatter) => [
            formatter.id, 
            prepareRuntimeContextWithFormatter(buildAst(formatter.code))
        ])),
        [formatters],
    )

    if (workArea === undefined || !workAreaFormatters || !workAreaDocuments || !documents || !formatters || !formatterContextByFormatterId) {
        return <h1>{i18n.t('common:loading')}</h1>
    }

    if (!workArea) {
        return <h1>{i18n.t('common:nothing')}</h1>
    }

    return (
        <>
            <h1>{workArea.label}@{workArea.id}</h1>

            {documents.map((document) => {
                const context = formatterContextByFormatterId[formatters.find(f => f.type === document.type)?.id!]

                return formatDocument(context, document.meta)
            })}
        </>
    )
}

export default WorkArea;