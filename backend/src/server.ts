import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: '*', // In production, we can replace this with a list of allowed domains
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id']
}));
app.use(express.json());

// Load API Routes
app.use('/api', apiRoutes);

// Error Handling (Basic)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`
    🚀 Banho e Tosa - Backend Operacional iniciado!
    📡 Porta: ${PORT}
    🔗 API Base: http://localhost:${PORT}/api
    `);
});
