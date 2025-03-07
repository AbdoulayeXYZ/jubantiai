import 'reflect-metadata';
import { AppDataSource } from './configs/data-sources';
import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';
import cors from 'cors';
// importer UserRoute ici 


// Configuration de l'environnement
dotenv.config();

// Initialisation Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de base
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express server!');
});

// Démarrage du serveur après la connexion à la base de données
const startServer = async () => {
  try {
    // Démarrage du serveur Express d'abord
    const server = app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
    });

    // Puis tentative de connexion à la base de données
    try {
      await AppDataSource.initialize();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      // Le serveur continue de fonctionner même si la BD ne se connecte pas
    }
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();

export default app;