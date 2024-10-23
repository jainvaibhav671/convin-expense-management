import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import { Form, Link, Outlet, useLoaderData } from "react-router-dom";

export default function Header() {
    const loaderData = useLoaderData() as { userId: string | undefined }
    const { userId, setUserId } = useAuthStore()
    const isAuthenticated = userId.length != 0

    useEffect(() => {
        setUserId(loaderData.userId || "")
    }, [])

    return (
        <header className="flex justify-between p-8 border-b border-foreground/10">
            <h1 className="text-3xl font-bold">Expense Tracker</h1>

            <div className="flex gap-4">
                {!isAuthenticated && (
                    <Button size="lg" asChild>
                        <Link to="/login">Login</Link>
                    </Button>
                )}
                {!isAuthenticated && <Outlet />}
                {isAuthenticated && <Form method="POST" action="/logout">
                    <Button type="submit" size="lg">Logout</Button>
                </Form>}
            </div>
        </header>
    )
}
