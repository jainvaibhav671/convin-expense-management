import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast"

export default function AuthForm({ formType }: { formType: "login" | "register" }) {
    const navigate = useNavigate()
    const actionData = useActionData() as { success: boolean, userId: string, errors: { [key: string]: string[], formErrors: string[] } | undefined } | undefined
    const setUserId = useAuthStore(state => state.setUserId)
    const { toast } = useToast()

    const isFieldError = typeof actionData !== "undefined" && typeof actionData.errors !== "undefined"

    useEffect(() => {
        if (typeof actionData?.errors?.formError !== "undefined") {
            toast({
                title: "Form Error",
                description: actionData.errors.formError,
                variant: "destructive",
            })
            return
        }

        if (!actionData?.success) return

        console.log(actionData)

        setUserId(actionData?.userId || "")
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
                                {isFieldError && <p className="text-destructive">{typeof actionData?.errors?.name !== "undefined" && actionData.errors.name[0]}</p>}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="email" id="email" placeholder="Eg. john@example.com" />
                            {isFieldError && <p className="text-destructive">{typeof actionData?.errors?.email !== "undefined" && actionData.errors.email[0]}</p>}
                        </div>
                        {formType === "register" && (
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="phoneno">Phone Number</Label>
                                <Input name="phoneno" type="number" id="phoneno" placeholder="Eg. 99XXXXXXXX" />
                                {isFieldError && <p className="text-destructive">{typeof actionData?.errors?.phoneno !== "undefined" && actionData?.errors?.phoneno[0]}</p>}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" type="password" id="password" placeholder="Eg. *********" />
                            {isFieldError && typeof actionData?.errors?.password !== "undefined" && (
                                <div className="flex flex-col gap-1 my-1">
                                    {actionData?.errors?.password.map((e, i) => <p className="text-destructive" key={`error-${i}`}>{e}</p>)}
                                </div>
                            )}
                        </div>
                        {formType === "register" && (
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input name="confirmPassword" type="password" id="confirmPassword" placeholder="Eg. *********" />
                                {isFieldError && <p className="text-destructive">{typeof actionData?.errors?.confirmPassword !== "undefined" && actionData?.errors?.confirmPassword[0]}</p>}
                            </div>
                        )}
                        <Button type="submit" className="capitalize">{formType}</Button>
                        {/* <p className="text-destructive">{typeof actionData?.errors?.formError !== "undefined" && actionData.errors.formError}</p> */}
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
