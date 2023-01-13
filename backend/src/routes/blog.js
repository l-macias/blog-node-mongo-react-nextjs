import express from "express";

import {
    requireSignin,
    adminMiddleware,
    authMiddleware,
    canUpdateDeleteBlog,
} from "../controllers/auth.js";

import {
    create,
    list,
    listAllBlogsCategoriesTags,
    read,
    update,
    remove,
    photo,
    listRelated,
    listSearch,
    listByUser,
} from "../controllers/blog.js";
const routerBlog = express.Router();

routerBlog.post(
    "/blog",
    requireSignin,
    adminMiddleware,
    create,
    canUpdateDeleteBlog
);
routerBlog.get("/blogs", list);
routerBlog.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
routerBlog.get("/blog/:slug", read);
routerBlog.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
routerBlog.put("/blog/:slug", requireSignin, adminMiddleware, update);
routerBlog.get("/blog/photo/:slug", photo);
routerBlog.post("/blogs/related", listRelated);
routerBlog.get("/blogs/search", listSearch);

//auth user blog crud
routerBlog.post("/user/blog", requireSignin, authMiddleware, create);
routerBlog.get("/:username/blogs", listByUser);
routerBlog.delete(
    "/user/blog/:slug",
    requireSignin,
    authMiddleware,
    canUpdateDeleteBlog,
    remove
);
routerBlog.put(
    "/user/blog/:slug",
    requireSignin,
    authMiddleware,
    canUpdateDeleteBlog,
    update
);

export default routerBlog;
