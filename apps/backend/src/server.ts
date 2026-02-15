import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'test'
    ? '.env.test'
    : '.env';

dotenv.config({ path: envFile });

import { createApp } from './app';
import { bootstrapMongoDB } from './infra/db/mongo.bootstrap';

async function startServer() {
    await bootstrapMongoDB();

    const app = createApp();
    const PORT = Number(process.env.PORT ?? 3001);

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV ?? 'development'} mode`);
        console.log(`http://localhost:${PORT}`);
    });
}

startServer();
