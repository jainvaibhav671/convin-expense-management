import { IExpense, Expense } from "../models/expense";
import { Router, Request, Response } from "express"

import { authenticateToken } from "../middlewares/authMiddleware"

const router = Router()

router.use(authenticateToken);

router.post("/add", async (req, res): Promise<void> => {
    // @ts-ignore
    const userId = req.user.id as string
    try {
        const { title, description, amount, splitMethod, splitDetails, participants } = req.body;
        console.log(req.body)

        // Validate percentages if splitMethod is 'percentage'
        if (splitMethod === 'percentage' && splitDetails.reduce((a: number, b: number) => a + b, 0) !== 100) {
            res.status(400).json({ message: 'Percentages must sum to 100%' });
            return
        }

        const expense: IExpense = new Expense({
            title,
            description,
            amount,
            splitMethod,
            splitDetails,
            participants,
            userId
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

router.get("/user", async (req, res): Promise<void> => {
    // @ts-ignore
    const userId = req.user.id as string;

    try {
        const expenses = await Expense.find({ userId });
        res.json(expenses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/overall", async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const expenses = await Expense.find({ userId: req.user.id as string });
        console.log(expenses)

        let dues: Record<string, number> = {}
        expenses.forEach(expense => {
            const participants = expense.get("participants")
            const splitDetails = expense.get("splitDetails")

            participants.forEach((participant, index) => {
                if (index == 0) return

                const due = splitDetails[index]
                if (dues[participant]) {
                    dues[participant] += due
                } else {
                    dues[participant] = due
                }
            })

        })

        res.json({
            overall_spend: expenses.reduce((a,b) => a + b.get("splitDetails")[0], 0),
            amount_to_recover: Object.values(dues).reduce((a,b) => a + b, 0),
            overall_dues: dues
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/balance-sheet/:userId", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const expenses = await Expense.find({ participants: userId }).populate('participants', 'name');

        // Implement logic to generate and download balance sheet (CSV, PDF, etc.)

        res.send('Balance sheet download functionality');
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.cookies.token)
        const expense = await Expense.findById(req.params.id);
        res.json(expense);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

export default router
