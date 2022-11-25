import express from "express";

import { requireSignin, adminMiddleware } from "../controllers/auth.js";

import {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  update,
  remove,
  photo,
} from "../controllers/blog.js";
const routerBlog = express.Router();

routerBlog.post("/blog", requireSignin, adminMiddleware, create);
routerBlog.get("/blogs", list);
routerBlog.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
routerBlog.get("/blog/:slug", read);
routerBlog.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
routerBlog.put("/blog/:slug", requireSignin, adminMiddleware, update);
routerBlog.get("/blog/photo/:slug", photo);

export default routerBlog;
