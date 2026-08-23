import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find();

      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
};