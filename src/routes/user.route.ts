import express from "express";
import { prisma } from "../models/index.model";
export const UserRouter = express.Router();

UserRouter.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        const usermodel  = await prisma.user.create({
            data:{
                name,
                email,
                password
            }
        });
        res.status(201).json({
            message:"User created successfully",
            user:usermodel
        });
    }catch(error){
        res.status(500).json({
            message:"User creation failed",
            error:error
        });
    }
});

