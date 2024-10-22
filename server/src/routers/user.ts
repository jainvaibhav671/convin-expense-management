import { Router } from "express"
import { Request, Response } from 'express';
import { User, IUser } from '@/models/user';

const router = Router()

router.post("/create", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, mobile } = req.body;
        const user: IUser = new User({ name, email, mobile });
        await user.save();
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser | null = await User.findById(req.params.id);
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
