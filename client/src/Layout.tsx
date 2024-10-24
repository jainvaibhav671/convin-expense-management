import axios from "axios"
import { LoaderFunction, Outlet } from "react-router-dom"
import Header from "@/components/Header"
import { useAuthStore } from "@/lib/store"

const API_URL = import.meta.env.VITE_API_URL as string

export const loader: LoaderFunction = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/auth/authenticated`, {
            withCredentials: true
        })
        return response.data
    } catch (error: any) {
        return { userId: undefined }
    }
}

function App() {

    const userId = useAuthStore(state => state.userId)

    return (
        <div className="m-0 flex flex-col">
            <Header />
            <div className="grid place-items-center">
                {userId.length == 0 && <h1 className="text-2xl font-semibold">Login in to start using the app</h1>}
                {userId.length != 0 && <Outlet />}
            </div>
        </div>
    )
}

export default App
