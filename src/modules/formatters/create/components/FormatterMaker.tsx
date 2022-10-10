import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ReactJson from "react-json-view";
import { Context } from "../../../../interpreter/ast/Context";

import lexer from "../../../../interpreter/lexer";
import parser from "../../../../interpreter/parser";
import { Runtime } from "../../../../interpreter/runtime";

import { AppDatabase, useDexie, useLazyDexie } from "../../../../module-core/database";
import { useTranslate } from "../../../../module-core/i18n-js";
import { delay, useCache, useLoading } from "../../../common";

import { Formatter } from "../../types";

const runtimize = (value: string | null | undefined | number | boolean | Record<string, any>): Runtime => {
    if (!value) {
        return new Runtime.Null()
    }

    switch (typeof value) {
        case "boolean": return new Runtime.Boolean(value)
        case "object": return new Runtime.Object(
            Object.fromEntries(
                Object.entries(value).map(([key, v]) => [key, runtimize(v)])
            )
        )
        case "string": return new Runtime.String(value)
        case "number": return new Runtime.Number(value)
        default:
            throw new Error(`Mustn't be called`)
    }
}

const tryCode = (code: string, document: Record<string, any>) => {
    try {
        const tokens = lexer.tokenize(code)
        const ast = parser.parse(tokens)
        const context: Context = {}
        ast.execute(context)
        
        if (!context.format || !Runtime.tryCast(context.format as Runtime, Runtime.Function)) {
            throw new Error(
                `Error: You must create function with name format, that use one argument (it will be document described with type)`
            )
        }

        const callAst = parser.parse(lexer.tokenize(`format(document);`))
        const runtime = callAst.execute({
            ...context,
            document: runtimize(document)
        })

        return { output: Runtime.cast(runtime, Runtime.String).getValue(), error: null }
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