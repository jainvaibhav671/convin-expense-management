import { Form, LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import axios from "axios";
import ParticipantList from "./ParticipantList";

const API_URL = import.meta.env.VITE_API_URL as string

export const loader: LoaderFunction = async () => {
    const response = await axios.get(`${API_URL}/api/user`, {
        withCredentials: true
    })

    return response.data
}

export default function AddExpense() {

    const navigate = useNavigate()

    const [amount, setAmount] = useState<number>(0)
    const [splitMethod, setSplitMethod] = useState("equal")

    return (
        <div>
            <Dialog open={true} onOpenChange={() => navigate("/")}>
                <DialogContent className="overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                        <DialogDescription>
                            Create a new expense
                        </DialogDescription>
                    </DialogHeader>
                    <Form method="POST" action="/add-expense" className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input name="title" id="title" placeholder="Title" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Textarea className="resize-none" name="description" id="description" placeholder="Description" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex w-full flex-col gap-2">
                                <Label htmlFor="amount">Total Amount</Label>
                                <Input value={amount || ""} onChange={(e) => setAmount(parseInt(e.target.value))} required name="amount" id="amount" type="number" placeholder="Amount" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="split-method">Split Method</Label>
                                <Select name="split-method" value={splitMethod} onValueChange={(val) => setSplitMethod(val)} required>
                                    <SelectTrigger id="split-method">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="equal">Equal</SelectItem>
                                        <SelectItem value="exact">Exact</SelectItem>
                                        <SelectItem value="percent">Percent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ParticipantList totalAmount={amount || 0} splitMethod={splitMethod} />
                        </div>

                        <Button type="submit">Add</Button>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
