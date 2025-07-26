import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (!process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_EXPIRES_IN environment variable is required');
}

export const JWT_SECRET: string = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN;