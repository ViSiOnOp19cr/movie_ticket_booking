import express from "express";
import authController from "../controllers/Auth.Controller";

export const UserRouter = express.Router();

UserRouter.post("/register",authController.signup); 
UserRouter.post("/login",authController.login);




