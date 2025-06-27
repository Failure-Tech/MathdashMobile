import { default as bcrypt } from "bcryptjs";
import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/User";

const router: Router = express.Router();

// Signup auth
router.post("/signup", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return void res.status(400).json({ message: "User exists"} );
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

    const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d"});
    res.json({ token });
});

// Login auth
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
        return void res.status(401).json({ message: "Invalid User Email/Credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return void res.status(401).json({ message: "Invalid Password/Credentials "});
    }

    const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d"});
    res.json({ token });
});

// Google Sign in Auth
router.post("/google", async (req, res) => {
    const { email, googleId} = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, googleId });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {expiresIn: "7d"});
    res.json({ token });
});

export default router;