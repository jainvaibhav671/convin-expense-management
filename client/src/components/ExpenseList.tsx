import { Expense } from "@/types"
import { Link, Outlet, useLoaderData } from "react-router-dom"
import { Button } from "./ui/button"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ExpenseList() {
    const { expenses } = useLoaderData() as { expenses: Expense[] }

    return (
        <div className="flex-1 px-8 py-12 w-5/12 flex flex-col gap-4 text-center">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl font-bold">Expenses</h2>
                <Button variant="default" asChild><Link to="/add-expense">Add Expense</Link></Button>
            </div>
            {expenses.length == 0 && <p className="text-lg mt-16">No expenses found</p>}
            <div className="flex flex-col gap-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Your Share</TableHead>
                            <TableHead>No of Participants</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map(expense => {
                            const d = new Date(expense.date)
                            return (
                                <TableRow key={expense._id}>
                                    <TableCell>{expense.title}</TableCell>
                                    <TableCell>{expense.amount}</TableCell>
                                    <TableCell>{expense.splitDetails[0]}</TableCell>
                                    <TableCell>{expense.splitDetails.length}</TableCell>
                                    <TableCell>{d.toDateString()}</TableCell>
                                    <TableCell className="flex flex-col">
                                        <Button asChild variant="link">
                                            <Link to={`/expense/${expense._id}`}>Show</Link>
                                        </Button>
                                    </TableCell>
                                    <Outlet />
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
