import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../configs/data-sources';
import { User } from '../entities/user.entity';

const userRepository = AppDataSource.getRepository(User);

// Service d'enregistrement de l'utilisateur
export const registerUser = async (userData: { email: string; password: string; role: string; }) => {
    const { email, password, role } = userData;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Registration failed: User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = userRepository.create({
        email,
        password: hashedPassword,
        role: role as 'teacher' | 'student',
    });

    await userRepository.save(newUser);
    return newUser;
};

// Service d'authentification de l'utilisateur
export const authenticateUser = async (email: string, password: string) => {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        throw new Error('Authentication failed: User not found with this email');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Authentication failed: Invalid credentials provided');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'default_secret', 
        { expiresIn: '1h' }
    );

    return { user, token };
};

// Service pour récupérer tous les utilisateurs
export const getAllUsers = async () => {
    const users = await userRepository.find({
        select: ["id", "email", "role", "createdAt", "updatedAt"] // Exclure le password
    });
    return users;
};
