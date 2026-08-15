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


