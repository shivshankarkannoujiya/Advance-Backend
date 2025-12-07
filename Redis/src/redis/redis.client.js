import { createClient } from 'redis';
import { ENV } from '../config/env.js';

const redisClient = createClient({
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASS,
    socket: {
        host: 'redis-19689.c239.us-east-1-2.ec2.cloud.redislabs.com',
        port: 19689,
    },
});

redisClient.on('error', (error) => {
    console.log('REDIS CLIENT ERROR: ', error);
});

redisClient.on('connect', () => {
    console.log('CONNECTING TO REDIS...');
});

redisClient.on('ready', () => {
    console.log('REDIS CLIENT CONNEDCTED SUCCESSFULLY !!');
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
    }
};

export { redisClient, connectRedis };
