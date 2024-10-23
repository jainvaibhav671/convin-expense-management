import axios from "axios";
import { ActionFunction } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL as string

export const loginAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, Object.fromEntries(formData.entries()), {
            withCredentials: true,
        })
        return { userId: response.data.userId }
    } catch (error: any) {
        console.log(error)
        return null
    }
}

export const registerAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, Object.fromEntries(formData.entries()), {
            withCredentials: true,
        })
        return { userId: response.data.userId }
    } catch (error: any) {
        console.log(error)
        return null
    }
}

export const logoutAction: ActionFunction = async () => {
    try {
        await axios.get(`${API_URL}/api/auth/logout`, {
            withCredentials: true
        })

        return { logout: true }
    } catch (error: any) {
        console.log(error)
        return null
    }
}
