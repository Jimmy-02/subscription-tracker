import { Router } from "express";

import { getUser, getUsers } from "../controllers/user.controller.js";
import { authorize, requireAdmin } from "@/middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, requireAdmin, getUsers);
userRouter.get("/:id", authorize, getUser);

export default userRouter;