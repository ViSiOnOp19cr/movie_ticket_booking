import authService from '../services/AuthService';
import { Request, Response } from 'express';
interface UserRequest extends Request {
    user: number;
}

const authController = {
    async signup(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;
            const result = await authService.RegisterUser({
                email,
                password,
                name
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: result.user,
                    token: result.token
                }
            });

        } catch (error: any) {
            if (error.message === 'User already exists') {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists',
                    data: null,
                    timestamp: new Date().toISOString()
                });
            }

            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null,
                timestamp: new Date().toISOString()
            });
        }
    },
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.LoginUser({ email, password });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });

        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                    data: null,
                    timestamp: new Date().toISOString()
                });
            }

            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                    data: null,
                    timestamp: new Date().toISOString()
                });
            }

            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null,
                timestamp: new Date().toISOString()
            });
        }
    }
};

export default authController;