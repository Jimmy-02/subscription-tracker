import { createSubscription } from "@/controllers/subscription.controller.js";
import { authorize } from "@/middleware/auth.middleware.js";
import { Router } from "express";


const subscriptionRouter = Router();

subscriptionRouter.post("/", authorize, createSubscription);

export default subscriptionRouter;