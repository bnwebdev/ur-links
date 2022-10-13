import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const useParamId = (redirectTo: string = '/404') => {
    const { id } = useParams()
    const navigate = useNavigate()

    const workAreaId = Number(id)

    useEffect(() => {
        if (Object.is(workAreaId, NaN)) {
            navigate('/404')
        }
    }, [workAreaId, navigate])

    return workAreaId;
}