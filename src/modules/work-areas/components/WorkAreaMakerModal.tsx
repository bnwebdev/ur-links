import { FC, useRef } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useTranslate } from "../../../module-core/i18n-js"
import { ErrorPrinter } from "../../common"
import { WorkArea } from "../types"

type Props = {
    show: boolean
    handleClose: () => void
    loading: boolean
    handleSave: (workArea: Pick<WorkArea, 'label'>) => void
}

const WorkAreaMakerModal: FC<Props> = ({ show, handleClose, loading, handleSave }) => {
    const { register, formState: { errors }, handleSubmit } = useForm<WorkArea>()
    const submitRef = useRef<HTMLInputElement>(null)
    const i18n = useTranslate()

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>Create Work Area</Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit(handleSave)} >
                <Form.Group>
                    <Form.Label>{i18n.t("work-areas.createForm.workAreaLabel")}</Form.Label>
                    <Form.Control {...register('label', { required: { value: true, message: i18n.t("work-areas.createForm.inputWorkAreaLabel") } })}/>
                </Form.Group>
                <ErrorPrinter error={errors.label?.message}/>
                <Form.Control type="submit" hidden ref={submitRef}/>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={loading} onClick={() => submitRef.current?.click()}>
                    {i18n.t("work-areas.createForm.okText")}
                </Button>
                <Button onClick={handleClose} disabled={loading}>
                    {i18n.t("work-areas.createForm.cancelText")}
                </Button>
            </Modal.Footer>
            </Modal>
    )
}

export default WorkAreaMakerModal