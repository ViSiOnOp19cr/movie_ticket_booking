import express from "express";
import { userMiddlewares } from "../middlewares/auth";
import { createMovie } from "../controllers/movie.controller";
export const MovieRouter = express.Router();


//create a movie 
//get all movies 
//get a movie by id 
//update a movie 
//delete a movie 
//get all movies by theater id
//get moveis by regex 
//get all movies by theater id and regex
//get all movis by city.
MovieRouter.post('/create', userMiddlewares, createMovie);
