import Subscription from "@/models/subscription.model.js";
import { Request, Response, NextFunction } from "express";

export const createSubscription = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        })

        res.status(201).json({ success: true, data: { subscription } });

    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req: Request,res: Response,next: NextFunction) => {
  try {
    if(req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this account",
      });
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}