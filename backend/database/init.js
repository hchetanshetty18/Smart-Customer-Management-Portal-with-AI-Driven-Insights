import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'saas_kastomer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function initDatabase() {
    const client = await pool.connect();
    
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await client.query(schema);
        console.log('Database schema initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

initDatabase()
    .then(() => {
        console.log('Database initialization complete');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Database initialization failed:', err);
        process.exit(1);
    });