import { Request, Response } from "express";
import { prisma } from '../lib/db'


export const createMovie = async (req: Request, res: Response) => {
    try {
        const {
            movie_name,
            description,
            durationMinutes,
            genre,
            rating,
            posterUrl,
            releaseDate
        } = req.body;
        console.log(req.body);


        const userId = req.userId
        const adminUser = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: { isAdmin: true }
        });


        console.log(adminUser);


        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to hit this endpoint",
            });
        };

        await prisma.movie.create({
            data: {
                movie_name,
                description,
                durationMinutes,
                genre,
                rating,
                posterUrl,
                releaseDate
            }
        });

        
        return res.status(201).json({
            message: "Movie created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message:"server is down try again later"
        });
    }
}
