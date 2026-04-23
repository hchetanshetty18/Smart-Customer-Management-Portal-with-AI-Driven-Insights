import dotenv from 'dotenv';
import app from './app.js';
import { closePool } from './utils/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoints: http://localhost:${PORT}/api/dashboard`);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await closePool();
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(async () => {
        await closePool();
        console.log('Server closed');
        process.exit(0);
    });
});