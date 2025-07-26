import { prisma } from "../lib/db"
import { Request, Response, NextFunction } from 'express';
import { signupSchema, signinSchema } from '../lib/validation';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../lib/config';

export const SignUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validateSignup = signupSchema.safeParse(req.body);

        if(!validateSignup.success){
            res.status(400).json({
                message: "Invalid input",
                errors: validateSignup.error
            });
            return;
        }
        const {email, password, name} = validateSignup.data;
        
        const salt = 12;
        const hash = await bcrypt.hash(password, salt);
        
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        });
        
        if(user){
            res.status(400).json({error:"user already exists"});
            return;
        }
        
        await prisma.user.create({
            data:{
                email: email,
                password: hash,
                name: name
            }
        });
        
        res.status(201).json({message:"user created successfully"});
    }
    catch(e){
        console.error('SignUp error:', e);
        res.status(500).json({message:"something is fishy try again later."});
    }
}

export const SignIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const Loginvalidation = signinSchema.safeParse(req.body);
        if(!Loginvalidation.success){
            res.status(400).json({
                message: "Invalid input",
                errors: Loginvalidation.error
            });
            return;
        }
        const {email, password} = Loginvalidation.data;
        
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        });
        
        if(!user){
            res.status(400).json({
                message:"email doesn't exist"
            });
            return;
        }
        
        const hashedpassword = await bcrypt.compare(password, user.password);
        if(!hashedpassword){
            res.status(400).json({
                message:"invalid password"
            });
            return;
        }
        
        const token = jwt.sign(
            {id: user.id},
            JWT_SECRET,
        );
        
        res.status(200).json({
            message:"logged in successfully",
            token: token
        });

    } catch(error){
        console.error('SignIn error:', error);
        res.status(500).json({
            message:"something seems to be fishy"
        });
    }
}

export const Me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if (!req.userId) {
            res.status(401).json({
                message: "User ID not found in request"
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where:{
                id: req.userId
            },
            select: {
                id: true,
                email: true,
                name: true,
            }   
        });
        
        if(!user){
            res.status(404).json({
                message:"user not found"
            });
            return;
        }
        
        res.status(200).json({
            message:"user found",
            user: user
        });
    }
    catch(error){
        console.error('Me error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


