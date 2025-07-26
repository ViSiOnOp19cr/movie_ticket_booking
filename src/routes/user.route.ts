import express from "express";
import { SignUp, SignIn, Me } from "../controllers/Auth.Controller";
import { userMiddlewares } from "../middlewares/auth";

export const UserRouter = express.Router();

UserRouter.post("/register",SignUp); 
UserRouter.post("/login",SignIn);
UserRouter.get("/me",userMiddlewares,Me);




