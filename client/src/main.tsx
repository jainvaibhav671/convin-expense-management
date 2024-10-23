import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout, { loader as layoutLoader } from '@/Layout'
import App, { loader as appLoader } from "@/App"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import { ThemeProvider } from '@/components/theme-provider';
import { logoutAction, loginAction, registerAction } from '@/actions/auth';
import Logout from '@/components/Logout';
import AuthForm from '@/components/AuthForm';
import AddExpense, { loader as addExpenseLoader } from './components/AddExpense';
import Error from "@/Error"
import { addExpenseAction, deleteExpenseAction } from './actions/expense';
import DeleteExpense from './components/DeleteExpense';

const router = createBrowserRouter([
    {
        path: "/",
        loader: layoutLoader,
        errorElement: <Error />,
        element: <Layout />,
        children: [
            {
                path: "/",
                loader: appLoader,
                element: <App />,
                children: [
                    {
                        loader: addExpenseLoader,
                        path: "/add-expense",
                        element: <AddExpense />,
                        action: addExpenseAction
                    },
                ]
            },
            {
                path: "/login",
                action: loginAction,
                element: <AuthForm formType="login" />
            },
            {
                path: "/register",
                action: registerAction,
                element: <AuthForm formType="register" />
            },
            {
                path: "/logout",
                action: logoutAction,
                element: <Logout />
            },
        ]
    },

]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>,
)
