import express from "express";
import {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} from "../controllers/auth.js";
import { read } from "../controllers/user.js";

const routerUser = express.Router();

routerUser.get("/profile", requireSignin, authMiddleware, read);

export default routerUser;
