import { useAuthStore } from "@/lib/store"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"

export default function Logout() {
    const setUserId = useAuthStore(state => state.setUserId)
    useEffect(() => {
        setUserId("")
    }, [])

    return <Navigate to="/" replace={true} />
}
