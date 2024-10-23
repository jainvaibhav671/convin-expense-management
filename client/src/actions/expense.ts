import { Participant } from "@/types";
import axios from "axios";
import { ActionFunction, redirect } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL as string

export const addExpenseAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const participants: Participant[] = JSON.parse(formData.get("participants") as string)
    const values = {
        title: formData.get("title"),
        description: formData.get("description"),
        amount: parseInt(formData.get("amount") as string),
        splitMethod: formData.get("split-method"),
        splitDetails: participants.map((p) => p.contribution),
        participants: participants.map((p) => p.name)
    }

    const response = await axios.post(`${API_URL}/api/expense/add`, values, { withCredentials: true })
    console.log(response)

    return null
}

export const deleteExpenseAction: ActionFunction = async ({ request }) => {
    try {
        console.log(request)
        await axios.delete(`${API_URL}/api/expense/${id}`, { withCredentials: true })
        return redirect("/")
    } catch (error) {
        console.log(error)
        return redirect("/")
    }
}
