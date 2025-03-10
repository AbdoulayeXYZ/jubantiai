import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../configs/data-sources';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AppError } from '../utils/app-error';

const userRepository = AppDataSource.getRepository(User);

interface ICreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher';
}

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async create(userData: ICreateUserDto): Promise<User> {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async update(id: number, userData: Partial<ICreateUserDto>): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        Object.assign(user, userData);
        return await this.userRepository.save(user);
    }

    async delete(id: number): Promise<void> {
        const user = await this.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await this.userRepository.remove(user);
    }
}

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
        process.env.JWT || 'default_secret', 
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
