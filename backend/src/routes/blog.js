import express from "express";
import getBlogs from "../controllers/blog.js";

const routerBlog = express.Router();

routerBlog.get("/blog", getBlogs);

export default routerBlog;
