import { Router } from "express"
import { Request, Response } from 'express';
import { User, IUser } from '@/models/user';
import { authenticateToken } from "@/middlewares/authMiddleware";

const router = Router()

router.use(authenticateToken)

router.get("/", async (req, res: Response): Promise<void> => {
    // @ts-ignore
    const userId = req.user.id as string
    try {
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/', async (req, res) => {
    res.send('User API');
});

export default router
