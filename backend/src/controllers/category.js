import { Category } from "../models/category.js";
import slugify from "slugify";
import errorHandler from "../helpers/dbErrorHandler.js";
class CategoryController {
  constructor() {}
  create(req, res) {
    try {
      let { name } = req.body;
      let slug = slugify(name).toLowerCase();
      let category = new Category({ name, slug });
      category.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
    } catch (error) {
      console.log("Error en metodo create");
    }
  }

  list(req, res) {
    try {
      Category.find({}).exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
    } catch (error) {
      console.log(error);
    }
  }
  read(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();

      Category.findOne({ slug }).exec((err, category) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(category);
      });
    } catch (error) {
      console.log(error);
    }
  }

  remove(req, res) {
    try {
      const slug = req.params.slug.toLowerCase();

      Category.findOneAndRemove({ slug }).exec((err, data) => {
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
      console.log(error);
    }
  }
}

const create = new CategoryController().create;
const list = new CategoryController().list;
const read = new CategoryController().read;
const remove = new CategoryController().remove;
export { create, list, read, remove };
