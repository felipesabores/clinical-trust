import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        // Permitir todas as origens (dinâmico) para resolver problemas com Traefik/Subdomínios
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'Accept', 'Origin'],
    credentials: true,
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: !!process.env.DATABASE_URL
    });
});

// Load API Routes
app.use('/api', apiRoutes);

// Error Handling (Basic)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`
    🚀 Banho e Tosa - Backend Operacional iniciado!
    📡 Porta: ${PORT}
    🔗 API Base: http://localhost:${PORT}/api
    `);

    if (!process.env.DATABASE_URL) {
        console.error('CRITICAL: DATABASE_URL is not defined! Prisma will crash.');
    }
});
