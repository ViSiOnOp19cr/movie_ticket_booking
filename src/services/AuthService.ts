import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index';


const prisma = new PrismaClient();

type UserRegister = {
    email: string;
    password: string;
    name: string;
}
type userLogin = {
    email: string;
    password: string;
}

const authService = {
    async RegisterUser({ email, password, name }: UserRegister) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                throw new Error('User already exists');
            }

            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            });
            const token = this.generateToken(user.id);

            return {
                user,
                token
            };
        } catch (error) {
            throw new Error('User registration failed');
        }
    },

    async LoginUser({ email, password }: userLogin) {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            const token = this.generateToken(user.id);

            const { password: _, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                token
            };
        } catch (error) {
            throw new Error('User login failed');
        }
    },

    async getUserById(userId: number) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    _count: {
                        select: { booking: true }
                    }
                }
            });

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error('User not found');
        }
    },

    generateToken(userId: number): string {
        if (!JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }
      
        try {
          const token = jwt.sign({ userId }, JWT_SECRET as string, {
            expiresIn: JWT_EXPIRES_IN as string
          });
          return token;
        } catch (error) {
          throw new Error('Token generation failed');
        }
    },

    verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET as string);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};

export default authService;