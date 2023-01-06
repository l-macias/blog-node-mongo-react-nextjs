import { User } from "../models/user.js";
import { Blog } from "../models/blog.js";
import _ from "lodash";
import formidable from "formidable";
import fs from "fs";
import errorHandler from "../helpers/dbErrorHandler.js";

class UserController {
  constructor() {}
  read(req, res) {
    try {
      req.profile.hashed_password = undefined;
      return res.json(req.profile);
    } catch (error) {
      console.log("Error en metodo read");
    }
  }

  publicProfile(req, res) {
    try {
      let username = req.params.username;
      let user;
      let blogs;

      User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
          return res.status(400).json({
            error: "Usuario no Encontrado",
          });
        }
        user = userFromDB;
        let userId = user._id;
        Blog.find({ postedBy: userId })
          .populate("categories", "_id name slug")
          .populate("tags", "_id name slug")
          .populate("postedBy", "_id name")
          .limit(10)
          .select(
            "_id title slug excerpt categories tags postedBy createdAt updatedAt"
          )
          .exec((err, data) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            user.photo = undefined;
            user.hashed_password = undefined;
            res.json({
              user,
              blogs: data,
            });
          });
      });
    } catch (error) {
      console.log("Error en metodo read");
    }
  }

  update(req, res) {
    try {
      let form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            error: "La foto no pudo ser subida",
          });
        }
        let user = req.profile;
        user = _.extend(user, fields);
        if (files.photo) {
          if (files.photo.size > 1000000) {
            return res.status(400).json({
              error: "La foto no puede superar 1mb",
            });
          }
          user.photo.data = fs.readFileSync(fields.photo.path);
          user.photo.contentType = files.photo.type;
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            user.hashed_password = undefined;
            res.json(user);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  photo(req, res) {
    try {
      User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "Usuario no encontrado",
          });
        }
        if (user.photo.data) {
          res.set("Content-Type", user.photo.contentType);
          return res.send(user.photo.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const read = new UserController().read;
const publicProfile = new UserController().publicProfile;
const update = new UserController().update;
const photo = new UserController().photo;
export { read, publicProfile, update, photo };
