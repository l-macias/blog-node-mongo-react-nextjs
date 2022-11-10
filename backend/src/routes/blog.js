import express from "express";
import create from "../controllers/blog.js";
import { requireSignin, adminMiddleware } from "../controllers/auth.js";

const routerBlog = express.Router();

routerBlog.post("/blog", requireSignin, adminMiddleware, create);

export default routerBlog;
