import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

console.log('Database Config:', {
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
}); // Log the database configuration for debugging

// Connexion à la base de données en utilisant les variables d'environnement

const sequelize = new Sequelize(
    process.env.DB_NAME as string,              // Le nom de la base de données
    process.env.DB_USERNAME as string,          // Le nom d'utilisateur de la base de données
    process.env.DB_PASSWORD as string,          // Le mot de passe de la base de données
    {
        host: process.env.DB_HOST,              // L'hôte de la base de données
        dialect: 'mysql',                       // Le type de base de données (MySQL dans ce cas)
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Port par défaut 3306 si non défini
        logging: false,                         // Désactiver le logging SQL pour ne pas surcharger les logs
    }
);

// Vérification de la connexion à la base de données
sequelize.authenticate()
    .then(() => console.log('Database connection established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));

export default sequelize;
