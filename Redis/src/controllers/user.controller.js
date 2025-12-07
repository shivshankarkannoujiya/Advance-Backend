import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { redisClient } from '../redis/redis.client.js';
import { asyncHandler } from '../utils/asyncHandler.js'; 
import { ApiError } from '../utils/ApiError.js'; 
import { ApiResponse } from '../utils/ApiResponse.js'; 



/**
 * Clears Redis cache for a specific user and the global list.
 * Use this whenever DB data changes (Create, Update, Delete).
 */
const clearUserCache = async (userId) => {
    try {
        await Promise.all([
            redisClient.del(`user:${userId}`), // Clear specific user
            redisClient.del('users:all'), // Clear list (it's now stale)
        ]);
    } catch (error) {
        console.error('Redis Cache Clean Error:', error);
    }
};


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    const createdUser = await User.findById(user._id).select('-password');
    if (!createdUser) {
        throw new ApiError(
            500,
            'Something went wrong while registering the user'
        );
    }

    await redisClient.del('users:all');

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, 'User registered successfully')
        );
});

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cacheKey = `user:${id}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    JSON.parse(cachedUser),
                    'User fetched from Cache'
                )
            );
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 3600 });

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'User fetched from DB'));
});

const getAllUser = asyncHandler(async (req, res) => {
    const cacheKey = 'users:all';

    const cachedUsers = await redisClient.get(cacheKey);
    if (cachedUsers) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    JSON.parse(cachedUsers),
                    'Users fetched from Cache'
                )
            );
    }

    const users = await User.find().select('-password');

    if (users.length > 0) {
        await redisClient.set(cacheKey, JSON.stringify(users), { EX: 3600 });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { count: users.length, users },
                'Users fetched successfully'
            )
        );
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { username } },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }

    // 2. Cache Invalidation (Critical!)
    // We must clear the old cache so `getUser` doesn't serve old data
    await clearUserCache(id);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select('-password');

    if (!deletedUser) {
        throw new ApiError(404, 'User not found');
    }

    // 2. Cache Invalidation
    await clearUserCache(id);

    return res
        .status(200)
        .json(new ApiResponse(200, deletedUser, 'User deleted successfully'));
});

export { registerUser, getUser, getAllUser, updateUser, deleteUser };
