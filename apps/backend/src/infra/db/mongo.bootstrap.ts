import { connectToMongoDB } from './mongo.connection'

export async function bootstrapMongoDB(): Promise<void> {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in environment variables')
    }

    await connectToMongoDB(mongoUri)
}