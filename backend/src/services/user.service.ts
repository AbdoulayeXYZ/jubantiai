import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import sequelize from '../configs/database.config'; // Correctly import the default export
import { AppDataSource } from '../configs/data-sources';

const User = UserModel(sequelize); // Initialize the User model with the Sequelize instance


// Service d'enregistrement de l'utilisateur
export const registerUser = async (userData: { email: string; password: string; role: string; }) => {
    const { email, password, role } = userData;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Registration failed: User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        role: role as 'teacher' | 'student',
    });

    return newUser;
};

// Service d'authentification de l'utilisateur
export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Authentication failed: User not found with this email');

    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Authentication failed: Invalid credentials provided');

    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

    return { user, token };
};
