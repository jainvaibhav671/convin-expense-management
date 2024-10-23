import { Form, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

export default function DeleteExpense({ id }: { id: string }) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    console.log(id)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Expense</DialogTitle>
                    <DialogDescription>This will delete this expense permanenly!!</DialogDescription>
                </DialogHeader>
                <p>Are you sure you want to delete this expense?</p>
                <DialogFooter>
                    <Form method="GET" action={`/delete-expense/${id}`}>
                        <Button type="submit" variant="destructive">Delete</Button>
                    </Form>
                    <Button variant="secondary" onClick={() => navigate("/")}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
