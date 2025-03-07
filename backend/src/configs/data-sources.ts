import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

console.log('Database configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../entities/*.entity.{ts,js}'],
  synchronize: true, 
  logging: true,
  connectTimeout: 30000, // Augmente le timeout de connexion
});