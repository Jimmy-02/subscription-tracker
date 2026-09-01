import { JWT_SECRET } from "@/config/env.js";
import User from "@/models/user.model.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            }
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            throw err;
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};