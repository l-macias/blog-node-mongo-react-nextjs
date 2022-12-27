import { Blog } from "../models/blog.js";
import { Category } from "../models/category.js";
import { Tag } from "../models/tag.js";
import formidable from "formidable";
import slugify from "slugify";
import { stripHtml } from "string-strip-html";
import _ from "lodash";
import errorHandler from "../helpers/dbErrorHandler.js";
import fs from "fs";
import { smartTrim } from "../helpers/blog.js";
class blogController {
  constructor() {}

  create(req, res) {
    try {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            error: "La imagen no pudo ser subida",
          });
        }

        const { title, body, categories, tags } = fields;

        if (!title || !title.length) {
          return res.status(400).json({
            error: "Falta colocar el título",
          });
        }

        if (!body || body.length < 200) {
          return res.status(400).json({
            error: "El contenido es muy pobre, necesita ser mas largo",
          });
        }

        if (!categories || categories.length === 0) {
          return res.status(400).json({
            error: "Es necesario especificar al menos una categoría",
          });
        }

        if (!tags || tags.length === 0) {
          return res.status(400).json({
            error: "Es necesario especificar al menos un TAG",
          });
        }

        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, " ", " ...");
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 140)).result;
        blog.postedBy = req.user._id;
        // blog.categories = categories;
        // blog.tags = tags;

        let arrayOfCategories = categories && categories.split(",");
        let arrayOfTags = tags && tags.split(",");

        if (files.photo) {
          if (files.photo.size > 10000000) {
            return res.status(400).json({
              error: "La imagen debe ser menor a 1MB",
            });
          }
          blog.photo.data = fs.readFileSync(files.photo.filepath);
          blog.photo.contentType = files.photo.type;
        }
        blog.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
              message: "Error guardando la imagen",
            });
          }
          // res.json(result);
          Blog.findByIdAndUpdate(
            result._id,
            {
              $push: { categories: arrayOfCategories },
            },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            } else {
              Blog.findByIdAndUpdate(
                result._id,
                { $push: { tags: arrayOfTags } },
                { new: true }
              ).exec((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                } else {
                  return res.json(result);
                }
              });
            }
          });
        });
      });
    } catch (error) {
      console.log(`Error en método create: ${error}`);
    }
  }
  list(req, res) {
    try {
      Blog.find({})
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username")
        .select(
          "_id title slug excerpt categories tags postedBy createdAt updatedAt"
        )
        .exec((err, data) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            });
          }
          res.json(data);
        });
    } catch (error) {
      console.log(error);
    }
  }

  listAllBlogsCategoriesTags(req, res) {
    try {
      let limit = req.body.limit ? parseInt(req.body.limit) : 10;
      let skip = req.body.skip ? parseInt(req.body.skip) : 0;

      let blogs;
      let categories;
      let tags;

      Blog.find({})
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username profile")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "_id title slug excerpt categories tags postedBy createdAt updatedAt"
        )
        .exec((err, data) => {
          if (err) {
            return res.json({
              error: err,
            });
          }
          blogs = data; //blogs
          //get all categories
          Category.find({}).exec((err, c) => {
            if (err) {
              return res.json({
                error: errorHandler(err),
              });
            }
            categories = c; //all categories
            //get all tags
            Tag.find({}).exec((err, t) => {
              if (err) {
                return res.json({
                  error: errorHandler(err),
                });
              }
              tags = t; //all tags

              //return all blogs categories and tags
              res.json({ blogs, categories, tags, size: blogs.length });
            });
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  read(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();

      Blog.findOne({ slug })
        // .select("-photo")
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name username")
        .select(
          "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
        )
        .exec((err, data) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            });
          }
          res.json(data);
        });
    } catch (error) {
      console.log(error);
    }
  }

  remove(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();
      Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        res.json({ message: "Blog eliminado correctamente" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  update(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();

      Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
          if (err) {
            return res.status(400).json({
              error: "Image could not upload",
            });
          }

          let slugBeforeMerge = oldBlog.slug;
          oldBlog = _.merge(oldBlog, fields);
          oldBlog.slug = slugBeforeMerge;

          const { body, desc, categories, tags } = fields;

          if (body) {
            oldBlog.excerpt = smartTrim(body, 320, " ", " ...");
            oldBlog.desc = stripHtml(body.substring(0, 160));
          }

          if (categories) {
            oldBlog.categories = categories.split(",");
          }

          if (tags) {
            oldBlog.tags = tags.split(",");
          }

          if (files.photo) {
            if (files.photo.size > 10000000) {
              return res.status(400).json({
                error: "Image should be less then 1mb in size",
              });
            }
            oldBlog.photo.data = fs.readFileSync(files.photo.filepath);
            oldBlog.photo.contentType = files.photo.type;
          }

          oldBlog.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            // result.photo = undefined;
            res.json(result);
          });
        });
      });
    } catch (error) {
      console.log(`Error en método create: ${error}`);
    }
  }

  photo(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();
      Blog.findOne({ slug })
        .select("photo")
        .exec((err, blog) => {
          if (err || !blog) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          res.set("Content-Type", blog.photo.contentType);
          return res.send(blog.photo.data);
        });
    } catch (error) {
      console.log(error);
    }
  }
  listRelated(req, res) {
    try {
      let limit = req.body.limit ? parseInt(req.body.limit) : 3;

      const { _id, categories } = req.body.blog;

      Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)

        .populate("postedBy", "_id name profile")
        .select("title slug excerpt postedBy createdAt updatedAt")
        .exec((err, blogs) => {
          if (err) {
            return res.status(400).json({
              error: "No se encuentra el Blog" + err,
            });
          }

          res.json(blogs);
        });
    } catch (error) {
      console.log(error);
    }
  }

  listSearch(req, res) {
    try {
      console.log(req.query);
      const { search } = req.query;

      if (search) {
        Blog.find(
          {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { body: { $regex: search, $options: "i" } },
            ],
          },
          (err, blogs) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json(blogs);
          }
        ).select("-photo -body");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
const create = new blogController().create;
const listAllBlogsCategoriesTags = new blogController()
  .listAllBlogsCategoriesTags;
const read = new blogController().read;
const list = new blogController().list;
const update = new blogController().update;
const remove = new blogController().remove;
const photo = new blogController().photo;
const listRelated = new blogController().listRelated;
const listSearch = new blogController().listSearch;
export {
  create,
  listAllBlogsCategoriesTags,
  read,
  list,
  update,
  remove,
  photo,
  listRelated,
  listSearch,
};
