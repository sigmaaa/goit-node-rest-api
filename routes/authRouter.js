import express from "express";
import upload from "../middlewares/upload.js";

import validateBody from "../helpers/validateBody.js";
import {
  registerController,
  loginController,
  logoutController,
  getCurrentController,
  updateAvatarController,
} from "../controllers/authControllers.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.post("/logout", authenticate, logoutController);
authRouter.get("/current", authenticate, getCurrentController);
authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  updateAvatarController
);
export default authRouter;
