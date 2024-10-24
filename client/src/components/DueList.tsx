import { useLoaderData } from "react-router-dom"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table"

export default function DueList() {

    const { overall } = useLoaderData() as {
        overall: {
            overall_spend: number,
            amount_to_recover: number,
            overall_dues: Record<string, number>
        }
    }

    const dues = Object.entries(overall.overall_dues)

    return (
        <div className="pr-8 py-12 w-5/12 flex flex-col gap-4 text-center">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl font-bold">Friends</h2>
            </div>
            {dues.length == 0 && <p className="text-lg mt-16">No dues</p>}
            <div className="flex flex-col gap-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Due</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dues.map(([k, v]) => {
                            return (
                                <TableRow key={k}>
                                    <TableCell className="text-left">{k}</TableCell>
                                    <TableCell className="text-left">Rs. {v}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
