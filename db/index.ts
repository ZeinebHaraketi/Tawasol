import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from "dotenv";
// On charge les variables AVANT d'importer le reste
dotenv.config(); 

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

const sql = neon(process.env.DATABASE_URL!);

// On passe l'objet schema qui contient maintenant toutes tes tables et enums
export const db = drizzle(sql, { schema });