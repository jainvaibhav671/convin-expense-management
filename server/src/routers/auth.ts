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

        res.json({ message: 'Logged in successfully', userId: user._id });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { name, email, phoneno, password, confirmPassword } = req.body;
    console.log(req.body)

    try {
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: IUser = new User({
            name,
            email,
            mobile: phoneno,
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

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

router.get("/logout", (_req: Request, res: Response): void => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
})

router.get("/authenticated", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        res.json({ message: 'Authenticated', userId: decoded.id });
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }
})

export default router
