import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export default function AuthForm({ formType }: { formType: "login" | "register" }) {
    const navigate = useNavigate()
    const actionData = useActionData() as { userId: string } | undefined
    const setUserId = useAuthStore(state => state.setUserId)

    useEffect(() => {
        if (typeof actionData === "undefined") return;

        setUserId(actionData.userId)
        navigate("/")
    }, [actionData])

    return (
        <>
            <Dialog open={true} onOpenChange={() => navigate("/")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="capitalize">{formType}</DialogTitle>
                        <DialogDescription>Join us and know who ows you money</DialogDescription>
                    </DialogHeader>
                    <Form className="flex flex-col gap-4 mt-2" method="POST" action={formType === "login" ? "/login" : "/register"}>
                        {formType === "register" && (
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="name">Name</Label>
                                <Input name="name" type="text" id="name" placeholder="Eg. John Doe" />
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="email" id="email" placeholder="Eg. john@example.com" />
                        </div>
                        {formType === "register" && <div className="flex flex-col gap-4">
                            <Label htmlFor="phoneno">Phone Number</Label>
                            <Input name="phoneno" type="number" id="phoneno" placeholder="Eg. +91 99XXXXXXXX" />
                            <p className="text-sm">Include the country code</p>
                        </div>}
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" type="password" id="password" placeholder="Eg. *********" />
                        </div>
                        {formType === "register" && <div className="flex flex-col gap-4">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input name="confirmPassword" type="password" id="confirmPassword" placeholder="Eg. *********" />
                        </div>}
                        <Button type="submit" className="capitalize">{formType}</Button>
                        {formType === "login" && (
                            <div className="flex items-center gap-2">
                                <p>Not registered yet? </p>
                                <Button type="button" variant="link" className="-ml-4 hover:text-blue-400" asChild>
                                    <Link to="/register">Register</Link>
                                </Button>
                            </div>
                        )}
                        {formType === "register" && (
                            <div className="flex items-center gap-2">
                                <p>Already registered? </p>
                                <Button type="button" variant="link" className="-ml-4 hover:text-blue-400" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>

                            </div>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
