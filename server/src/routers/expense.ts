import { IExpense, Expense } from "@/models/expense";
import { Router, Request, Response } from "express"

const router = Router()

router.post("/add", async (req: Request, res: Response): Promise<void> => {
    try {
        const { description, amount, splitMethod, splitDetails, participants } = req.body;

        // Validate percentages if splitMethod is 'percentage'
        if (splitMethod === 'percentage' && splitDetails.reduce((a: number, b: number) => a + b, 0) !== 100) {
            res.status(400).json({ message: 'Percentages must sum to 100%' });
            return
        }

        const expense: IExpense = new Expense({
            description,
            amount,
            splitMethod,
            splitDetails,
            participants
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/user/:userId", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const expenses = await Expense.find({ participants: userId }).populate('participants', 'name');
        res.json(expenses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})
router.get("/overall", async (req: Request, res: Response): Promise<void> => {
    try {
        const expenses = await Expense.find().populate('participants', 'name');
        res.json(expenses);
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

export default router
