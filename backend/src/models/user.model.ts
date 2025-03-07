import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Définir les attributs de l'utilisateur
interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    role: 'teacher' | 'student';
    createdAt?: Date;
    updatedAt?: Date;
}

// Définir les attributs nécessaires pour la création d'un utilisateur
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Définir le modèle User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: 'teacher' | 'student';
    public createdAt!: Date;
    public updatedAt!: Date;

    // Méthode pour comparer les mots de passe
    public async comparePassword(password: string): Promise<boolean> {
        const bcrypt = require('bcrypt');
        return await bcrypt.compare(password, this.password);
    }
}

// Fonction pour initialiser le modèle
const UserModel = (sequelize: Sequelize) => {
    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('teacher', 'student'),
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // Automatically set to the current date
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // Automatically set to the current date
        }

    }, {
        sequelize,
        tableName: 'users',
    });

    return User;
};

export default UserModel; // Exporter le modèle
