import express from "express";
// import { } from "../controllers/category.js";
import { runValidation } from "../validators/index.js";
import { categoryCreateValidator } from "../validators/category.js";
import { create, list, read, remove } from "../controllers/category.js";
import { adminMiddleware, requireSignin } from "../controllers/auth.js";

const routerCategory = express.Router();

routerCategory.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
routerCategory.get("/categories", list);
routerCategory.get("/category/:slug", read);
routerCategory.delete(
  "/category/:slug",
  requireSignin,
  adminMiddleware,
  remove
);

export default routerCategory;
