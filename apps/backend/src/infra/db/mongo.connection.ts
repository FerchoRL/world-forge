import mongoose from "mongoose";

export async function connectToMongoDB(uri: string): Promise<void> {
    try {
        await mongoose.connect(uri);
        const { name, host } = mongoose.connection;
        console.log(`Mongo connected. Database: ${name} | Host: ${host}`);
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}