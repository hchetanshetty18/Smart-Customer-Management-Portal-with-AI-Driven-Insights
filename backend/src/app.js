import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', data: { status: 'healthy' } });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        data: null
    });
});

app.use(errorHandler);

export default app;