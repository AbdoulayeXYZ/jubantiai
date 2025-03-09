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

const sequelize = new Sequelize('jubantiai_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

// Vérification de la connexion à la base de données
sequelize.authenticate()
    .then(() => console.log('Database connection established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));

export default sequelize;
