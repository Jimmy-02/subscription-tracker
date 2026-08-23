import User from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find()

      res.status(200).json({ success: true, data: users })
    } catch (error) {
      next(error)
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params.id !== req.user._id.toString()) {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
      }
      
      const user = await User.findById(req.params.id).select('-password')
        
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error)
    }
};