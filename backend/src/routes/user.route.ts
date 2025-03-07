import express, { Request, Response } from 'express';
import { registerUser, authenticateUser, getAllUsers } from '../services/user.service';
const router = express.Router();

// Route d'enregistrement d'utilisateur
router.post('/register', async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Registration failed: Email, password, and role are required.' });
    }

    try {
        const newUser = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Route de connexion d'utilisateur
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authenticateUser(email, password);
        res.status(200).json({ user, token });
    } catch (error: unknown) {
        res.status(401).json({ error: 'Login failed: ' + (error as Error).message });

    }
});

// Route pour obtenir tous les utilisateurs
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
