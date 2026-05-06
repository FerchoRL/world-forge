import dotenv from 'dotenv';
import dns from 'node:dns';

const envFile =
  process.env.NODE_ENV === 'test'
    ? '.env.test'
    : '.env';

dotenv.config({ path: envFile });

function configureDnsServers() {
    const dnsServers = process.env.DNS_SERVERS
        ?.split(',')
        .map((server) => server.trim())
        .filter(Boolean)

    if (!dnsServers?.length) {
        return
    }

    dns.setServers(dnsServers)
    console.log(`Using DNS servers: ${dnsServers.join(', ')}`)
}

import { createApp } from './app';
import { bootstrapMongoDB } from './infra/db/mongo.bootstrap';

async function startServer() {
    configureDnsServers();
    await bootstrapMongoDB();

    const app = createApp();
    const PORT = Number(process.env.PORT ?? 3001);

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV ?? 'development'} mode`);
        console.log(`http://localhost:${PORT}`);
    });
}

startServer();
