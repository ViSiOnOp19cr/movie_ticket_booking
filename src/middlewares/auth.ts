import authService from '../services/AuthService';
import { Request, Response, NextFunction } from 'express';

interface UserRequest extends Request {
  userId: number;
}

const authenticateToken = async (req:UserRequest, res:Response, next:NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        data: null,
        timestamp: new Date().toISOString()
      });
    }
    const decoded = authService.verifyToken(token);
    
    const user = await authService.getUserById(decoded.userId);
    
    req.userId = user;
    
    next();
  } catch (error:any) {
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        data: null,
        timestamp: new Date().toISOString()
      });
    }
    console.error('Auth middleware error:', error);

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      data: null,
      timestamp: new Date().toISOString()
    });
  }
};

export default authenticateToken;