import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.route';
import characterRoutes from './routes/character.routes';

export function createApp() {
    const app = express();

    // use cors para permitir solicitudes desde otros orígenes
    app.use(cors());
    app.use(express.json());

    // Rutas de ejemplo
    app.use('/health', healthRouter)

    //Character routes
    app.use('/characters', characterRoutes)

    return app
}