import { LoaderFunction, Outlet, useLoaderData } from "react-router-dom";
import ExpenseList from "./components/ExpenseList";
import { useAuthStore } from "./lib/store";
import axios from "axios";
import DueList from "./components/DueList";

const API_URL = import.meta.env.VITE_API_URL as string

export const loader: LoaderFunction = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/expense/user`, {
            withCredentials: true
        })

        const r2 = await axios.get(`${API_URL}/api/expense/overall`, { withCredentials: true })

        return { expenses: response.data, overall: r2.data }
    } catch (error: any) {
        return { expenses: [] }
    }
}

export default function App() {
    const userId = useAuthStore(state => state.userId)

    const { overall } = useLoaderData() as {
        overall: {
            overall_spend: number,
            amount_to_recover: number,
            overall_dues: Record<string, number>
        }
    }

    if (userId.length == 0) return null
    return (
        <div className="flex flex-col gap-2 items-center justify-around">
            <div className="flex gap-4 pt-2">
                <div className="flex flex-col w-64 border border-blue-500 rounded-md gap-4 py-2 px-4">
                    <h3 className="text-lg font-bold">Overall</h3>
                    <p>Rs. {overall.overall_spend}</p>
                </div>
                <div className="flex flex-col w-64 border border-blue-500 rounded-md gap-4 py-2 px-4">
                    <h3 className="text-lg font-bold">Amount to Recover</h3>
                    <p>Rs. {overall.amount_to_recover}</p>
                </div>
            </div>
            <div className="flex gap-8 w-full justify-center">
                <ExpenseList />
                <DueList />
            </div>
            <Outlet />
        </div>
    )
}
