import express from "express";

import {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} from "../controllers/auth.js";
import { read, publicProfile, update, photo } from "../controllers/user.js";

const routerUser = express.Router();

routerUser.get("/user/profile", requireSignin, authMiddleware, read);
routerUser.get("/user/:username", publicProfile);
routerUser.put("/user/update", requireSignin, authMiddleware, update);
routerUser.get("/user/photo/:username", photo);

export default routerUser;
