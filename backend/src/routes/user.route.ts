import express, { Request, Response } from 'express';
import { registerUser, authenticateUser, getAllUsers, UserService } from '../services/user.service';
const router = express.Router();

// Route d'enregistrement d'utilisateur
router.post('/register', async (req: Request, res: Response) => {
    const { email, password, role, firstName, lastName } = req.body;
    if (!email || !password || !role || !firstName || !lastName) {
        return res.status(400).json({ error: 'Registration failed: Email, password, and role are required.' });
    }
    
    // Log the received data for debugging
    console.log('Register route received data:', req.body);

    try {
        const newUser = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post('/register-batch', async (req: Request, res: Response) => {
    const users = req.body;
    if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Expected an array of users' });
    }
    
    try {
        const results = [];
        for (const userData of users) {
            const { email, password, role, firstName, lastName } = userData;
            if (!email || !password || !role || !firstName || !lastName) {
                return res.status(400).json({ 
                    error: `User with email ${email || 'undefined'} is missing required fields` 
                });
            }
            const newUser = await registerUser(userData);
            results.push(newUser);
        }
        res.status(201).json({ 
            message: `${results.length} users registered successfully`, 
            users: results 
        });
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

// Route pour mettre à jour un utilisateur
router.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userData = req.body;
        
        // Créer une instance du service utilisateur
        const userService = new UserService();
        
        // Mettre à jour l'utilisateur
        const updatedUser = await userService.update(id, userData);
        
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
