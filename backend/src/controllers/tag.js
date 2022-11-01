import { Tag } from "../models/tag.js";
import slugify from "slugify";
import errorHandler from "../helpers/dbErrorHandler.js";
class TagController {
  constructor() {}
  create(req, res) {
    try {
      let { name } = req.body;
      let slug = slugify(name).toLowerCase();
      let tag = new Tag({ name, slug });
      tag.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
    } catch (error) {
      console.log(`Error en método create. Error: ${error}`);
    }
  }

  list(req, res) {
    try {
      Tag.find({}).exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
    } catch (error) {
      console.log(`Error en método list. Error: ${error}`);
    }
  }
  read(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();

      Tag.findOne({ slug }).exec((err, category) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(category);
      });
    } catch (error) {
      console.log(`Error en método read. Error: ${error}`);
    }
  }

  remove(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();

      Tag.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json({
          message: "Categoría eliminada correctamente",
        });
      });
    } catch (error) {
      console.log(`Error en método remove. Error: ${error}`);
    }
  }
}

const create = new TagController().create;
const list = new TagController().list;
const read = new TagController().read;
const remove = new TagController().remove;
export { create, list, read, remove };
