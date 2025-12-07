import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { connectRedis } from './redis/redis.client.js';

Promise.all([connectDB(), connectRedis()])
    .then(() => {
        app.listen(ENV.PORT, () => {
            console.log(`Server is listening at PORT:${ENV.PORT}`);
        });
    })
    .catch((error) => {
        console.error(`CONNECTION ERROR:`, error);
        process.exit(1);
    });
