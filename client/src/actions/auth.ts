import axios from "axios";
import { ActionFunction } from "react-router-dom";
import { z } from "zod"

const API_URL = import.meta.env.VITE_API_URL as string

const registerSchema = z.object({
    name: z
        .string({ required_error: "Name is required" }),
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email"),
    phoneno: z
        .string({ required_error: "Phone number is required" })
        .min(10, "Phone number must be 10 digits")
        .max(10, "Phone number must be 10 digits"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*?[#?!@$%^&*-])/, "Password must contain a special character")
        .regex(/(?=.*?[0-9])/, "Password must contain a number"),
    confirmPassword: z
    .string({ required_error: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email"),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*?[#?!@$%^&*-])/, "Password must contain a special character")
        .regex(/(?=.*?[0-9])/, "Password must contain a number")
})

export const loginAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData()

    const { error, success } = loginSchema.safeParse(Object.fromEntries(formData.entries()))
    if (!success) return {
        success,
        errors: error.formErrors.fieldErrors
    }

    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, Object.fromEntries(formData.entries()), {
            withCredentials: true,
        })
        return { success: true, userId: response.data.userId }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            errors: { formError: error.response.data.message }
        }
    }
}

export const registerAction: ActionFunction = async ({ request }) => {
    const formData = await request.formData()

    const { error, success } = registerSchema.safeParse(Object.fromEntries(formData.entries()))
    if (!success) return {
        success,
        errors: error.formErrors.fieldErrors
    }

    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, Object.fromEntries(formData.entries()), {
            withCredentials: true,
        })
        return { userId: response.data.userId }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            errors: { formError: error.response.data.message }
        }
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
