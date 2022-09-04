import { useState } from "react"

type Options = {
    beforeClose?: () => void
    afterClose?: () => void
    beforeOpen?: () => void
    afterOpen?: () => void
}

export const useModal = (options: Options = {}) => {
    const { beforeClose, afterClose, beforeOpen, afterOpen } = options;

    const [show, setShow] = useState(false)

    const close = () => {
        beforeClose && beforeClose();
        setShow(false);
        afterClose && afterClose();
    }
    const open = () => {
        beforeOpen && beforeOpen();
        setShow(true);
        afterOpen && afterOpen();
    }

    return { show, close, open }
}