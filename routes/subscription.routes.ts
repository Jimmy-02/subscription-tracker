import { createSubscription, getUserSubscriptions } from "@/controllers/subscription.controller.js";
import { authorize } from "@/middleware/auth.middleware.js";
import { Router } from "express";


const subscriptionRouter = Router();

subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

export default subscriptionRouter;