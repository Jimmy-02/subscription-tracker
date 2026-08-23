import { JWT_SECRET } from "@/config/env.js";
import User from "@/models/user.model.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]

        }

        if(!token) return res.status(401).json({message: 'Unauthorized'})
        
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = user;

        next()
    } catch (error) {
        res.status(401).json({message: 'Unauthorized',error: error instanceof Error ? error.message : String(error),});
    }
}