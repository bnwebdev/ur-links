import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Formatters: FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/not-implemented')
    }, [navigate])

    return null
}

export default Formatters