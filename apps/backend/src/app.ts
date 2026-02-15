import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.route';
import characterRoutes from './routes/character.routes';
import { errorHandler } from './middlewares/error-handler.middleware';

export function createApp() {
    const app = express();

    // use cors para permitir solicitudes desde otros orígenes
    app.use(cors());
    app.use(express.json());

    // Rutas de ejemplo
    app.use('/health', healthRouter)

    //Character routes
    app.use('/characters', characterRoutes)

    // Global JSON 404 for unknown routes
    app.use((_req, res) => {
        res.status(404).json({ error: 'Route not found' })
    })

    // Global error handling
    app.use(errorHandler)

    return app
}