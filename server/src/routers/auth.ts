import { User, IUser } from "@/models/user";
import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT and set it as a cookie
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({ message: 'Logged in successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { name, email, mobile, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT and set it as a cookie
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/logout", (_req: Request, res: Response): void => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
})

// router.get("/authenticated",)

export default router
