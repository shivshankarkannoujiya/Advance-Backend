import mongoose from 'mongoose';
import { ENV } from './env.js';
import { DB_NAME } from '../utils/constant.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${ENV.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `MONGODB CONNECTED SUCCESSFULLY!! DB_HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error(`MONGODB CONNECTION FAILED:`, error);
        process.exit(1);
    }
};

export { connectDB };
