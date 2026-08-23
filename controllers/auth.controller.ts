import User from "@/models/user.model.js";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config/env.js";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name, email, password} = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
            await session.abortTransaction();
            session.endSession();
            res.status(409).json({success: false, message: "User already exists",});
            return;
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"]} ) ;
         

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
          success: true,
          message: "User created successfully",
          data: {
            token,
            user: newUsers[0],
          },
        });

    }catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})

        if (!user) {
            res.status(404).json({success: false, message: "User not found",})
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: "Invalid password" })
            return
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"]})

        res.status(200).json({
          success: true,
          message: "User signed in successfully",
          data: {
            token,
            user,
          },
        });
    }catch (error) {
        next(error);
    }
}

