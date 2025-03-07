import { Request, Response } from 'express';
import { registerUser, authenticateUser } from '../services/user.service'; // Named imports
import User from '../models/user.model'; // Default import


class UserController {
    // Method to handle user registration
    async register(req: Request, res: Response) {
        try {
            const userData = req.body; // Assuming userData matches the expected structure

            const newUser = await registerUser(userData); // Use named import
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error registering user', error });
        }
    }

    // Method to handle user login
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await authenticateUser(email, password); // Use named import
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid credentials', error });
        }
    }
}

export default new UserController();
