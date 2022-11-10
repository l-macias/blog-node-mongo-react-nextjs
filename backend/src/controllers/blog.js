import { Blog } from "../models/blog.js";
import { Category } from "../models/category.js";
import { Tag } from "../models/tag.js";
import formidable from "formidable";
import slugify from "slugify";
import { stripHtml } from "string-strip-html";
import _ from "lodash";
import errorHandler from "../helpers/dbErrorHandler.js";
import fs from "fs";
import smartTrim from "../helpers/blog.js";
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
}
const create = new blogController().create;
export default create;
