import express from "express";
import { runValidation } from "../validators/index.js";
import { tagCreateValidator } from "../validators/tag.js";
import { create, list, read, remove } from "../controllers/tag.js";
import { adminMiddleware, requireSignin } from "../controllers/auth.js";

const routerTag = express.Router();

routerTag.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
routerTag.get("/tags", list);
routerTag.get("/tag/:slug", read);
routerTag.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

export default routerTag;
