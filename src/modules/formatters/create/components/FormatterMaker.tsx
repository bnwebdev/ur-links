import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ReactJson from "react-json-view";

import { AppDatabase, useDexie, useLazyDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import { delay, useCache, useLoading } from "../../../common";

import { Formatter } from "../../types";
import { buildAst, formatDocument, prepareRuntimeContextWithFormatter } from "../../utils";

const tryCode = (code: string, document: Record<string, any>) => {
    try {
        const ast = buildAst(code)
        const context = prepareRuntimeContextWithFormatter(ast)
        const serializedDocument = formatDocument(context, document)

        return { output: serializedDocument, error: null }
    } catch (err) {
        return { error: (err as Error).message, output: null }
    }
}

const FormatterMaker: FC = () => {
    const i18n = useTranslate()

    const [output, setOutput] = useState('')
    const [error, setError] = useState('')
    const [code, setCode] = useCache<string>('create-formatter-code')
    const [saving, setSaving] = useState(false)

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<Formatter>()
    
    const createFormatterQuery = useCallback(
        async (db: AppDatabase, formatter: Omit<Formatter, 'code'>) => {
            await db.formatters.add({ ...formatter, code: code as string })
            await delay(400);
            (setCode as any)('')
            reset()
        },
        [code, setCode, reset]
    )
    const createFormatterQueryWithLoading = useLoading(createFormatterQuery, setSaving)
    const [createFormatter] = useLazyDexie(createFormatterQueryWithLoading)

    const documentTypes = useDexie(db => db.documentTypes.toArray())

    const loadDocumentExampleQuery = useCallback((db: AppDatabase, type: number) => db.documents.where({ type }).first(), [])
    const [loadDocumentExample, documentExample] = useLazyDexie(loadDocumentExampleQuery)
    
    const documentTypeId = watch('type') || null

    useEffect(() => {
        documentTypeId !== null && loadDocumentExample(Number(documentTypeId))
        setOutput('')
    }, [documentTypeId, loadDocumentExample])

    if (!documentTypes) {
        return <h1>{i18n.t('common.loading')}</h1>
    }

    if (documentTypes.length === 0) {
        return <h1>You must create at least one document type</h1>
    }

    return( 
        <Form onSubmit={handleSubmit(createFormatter)}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control {...register("name", { required: true })}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Select {...register("type", { required: true, valueAsNumber: true })}>
                    <option value={""}>Choose document type</option>
                    {documentTypes.map(type => <option value={type.id} key={type.id}>{type.name}</option>)}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control value={code as string} onChange={(e) => (setCode as any)(e.currentTarget.value || '')} as="textarea" rows={6} />
            </Form.Group>
            {documentExample && (
                <Row className="align-items-stretch">
                    <Col xs={4}>
                        <ReactJson src={documentExample.meta}/>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-center align-items-center">
                        <Button onClick={() => {
                            const document = documentExample.meta
                            const { error, output } = tryCode(code as string, document)
                            console.log(error, output)
                            setOutput(output || '')
                            setError(error || '')
                        }}>Try format</Button>
                    </Col>
                    <Col xs={4}>
                        <p>{output}</p>
                        <p className="text-danger">{error}</p>
                    </Col>
                </Row>
            )}
            <h3 className="text-danger">{(errors.type || errors.code || errors.name)?.message || ""}</h3>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...': 'Save'}</Button>
        </Form>
    )
}

export default FormatterMaker;