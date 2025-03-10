import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/app-error';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, firstName, lastName, role } = req.body;

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
                return;
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer l'utilisateur
            const user = await this.userService.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role
            });

            // Générer le token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during registration'
            });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Vérifier si l'utilisateur existe
            const user = await this.userService.findByEmail(email);
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }

            // Vérifier le mot de passe
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }

            // Générer le token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during login'
            });
        }
    };
} 