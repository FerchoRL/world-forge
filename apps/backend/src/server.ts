import 'dotenv/config';
import { createApp } from './app';
import { Status } from '@world-forge/domain'
import { bootstrapMongoDB } from './infra/db/mongo.bootstrap';

async function startServer() {
    await bootstrapMongoDB()

    const app = createApp();
    const PORT = Number(process.env.PORT ?? 3001);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer()