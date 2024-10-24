import { LoaderFunction, redirect, useLoaderData, useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import axios from "axios"
import { Expense } from "@/types"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "./ui/table"
import { Button } from "./ui/button"
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL as string

export const loader: LoaderFunction = async ({ params }) => {
    if (typeof params.id === "undefined") return redirect("/")

    try {

        const response = await axios.get(`${API_URL}/api/expense/${params.id}`, {
            withCredentials: true
        })

        return response.data

    } catch (error: any) {
        console.log(error)
        return redirect("/")
    }
}

export default function ShowExpense() {

    const navigate = useNavigate()
    const data = useLoaderData() as Expense

    const handleDownloadBalanceSheet = () => {
        // Data to be included in the sheet
        const balanceSheetData = [
            ["Title", data.title],
            ["Description", data.description],
            ["Date", new Date(data.date).toLocaleString()],
            [],
            ["Name", "Share"]
        ];

        data.participants.forEach((participant, i) => {
            balanceSheetData.push([participant, `₹ ${data.splitDetails[i].toString()}`])
        });

        balanceSheetData.push([]);
        balanceSheetData.push(["Total Amount", data.amount.toString()]);

        // Create a worksheet from data
        const ws = XLSX.utils.aoa_to_sheet(balanceSheetData);

        // Set column widths
        ws['!cols'] = [
            { wch: 30 }, // "Name" column width
            { wch: 40 }  // "Share" column width
        ];
        ws['!rows'] = [
            { hpt: 20 },
            { hpt: 40 }
        ]

        // Apply basic styles (alignment, etc.)
        for (let row = 6; row <= 11; row++) {
            const cellAddress = `B${row}`;

            // If cell exists, apply style
            if (ws[cellAddress]) {
                ws[cellAddress].z = '"₹" 0.00'
            }
        }

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");

        // Generate and trigger file download
        XLSX.writeFile(wb, "BalanceSheet.xlsx");
    };

    return (
        <Dialog open={true} onOpenChange={() => navigate("/")}>
            <DialogContent className="overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{data.title}</DialogTitle>
                    <DialogDescription>{data.description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col">
                    <h3 className="text-base font-bold">Date</h3>
                    <p className="text-sm">{new Date(data.date).toDateString()}</p>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base font-bold">Total Amount</h3>
                    <p className="text-sm">&#8377; {data.amount}</p>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Share</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-y-auto">
                        {data.splitDetails.map((v, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>{data.participants[i]}</TableCell>
                                    <TableCell>{v}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <DialogFooter className="flex w-full mt-4">
                    <Button onClick={handleDownloadBalanceSheet}>Download Balance Sheet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
