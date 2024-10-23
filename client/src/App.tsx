import { LoaderFunction, Outlet } from "react-router-dom";
import ExpenseList from "./components/ExpenseList";
import { useAuthStore } from "./lib/store";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string

export const loader: LoaderFunction = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/expense/user`, {
            withCredentials: true
        })
        return { expenses: response.data }
    } catch (error: any) {
        return { expenses: [] }
    }
}

export default function App() {
    const userId = useAuthStore(state => state.userId)
    if (userId.length == 0) return null
    return (
        <div className="flex gap-2 justify-around">
            <ExpenseList />
            <Outlet />
        </div>
    )
}
