import { User } from "../models/user.js";
import shortId from "shortid";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
class authController {
  constructor() {}
  signup(req, res) {
    try {
      User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
          return res.status(400).json({
            error: "Ese Correo ya ha sido registrado",
          });
        }
        const { name, email, password } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`; //RARO- VER
        let newUser = new User({ name, email, password, profile, username });

        newUser.save((err, success) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          res.json({
            message: "Registro exitoso!. Por favor inicie sesión",
          });
        });
      });
    } catch (error) {
      console.log(`Error en signup: ${error}`);
    }
  }
  signin(req, res) {
    try {
      //check if user exist
      const { email, password } = req.body;
      User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "El usuario no existe. Por favor regístrese",
          });
        }
        //authenticate
        if (!user.authenticate(password)) {
          return res.status(400).json({
            error: "Email y contraseña no coinciden",
          });
        }
        //generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.cookie("token", token, { expiresIn: "1d" });
        const { _id, username, name, email, role } = user;
        return res.json({
          token,
          user: { _id, username, name, email, role },
        });
      });
    } catch (error) {
      console.log(`Error en signin: ${error}`);
    }
  }
  signout(req, res) {
    try {
      res.clearCookie("token");
      res.json({
        message: "Sesión finalizada correctamente",
      });
    } catch (error) {
      console.log(`Error en signout: ${error}`);
    }
  }
  requireSignin(req, res, next) {
    try {
      const token = req.headers.cookie
        ? req.headers.cookie.split("=")[1]
        : null;

      if (!token) {
        return res.status(400).json({
          error: "Acceso denegado",
        });
      }
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();

      // jwt({
      //   secret: process.env.JWT_SECRET,
      //   algorithms: ["HS256"],
      //   userPropery: "auth",
      // });
      // next();
    } catch (error) {
      console.log(`Error en requireSignin: ${error}`);
    }
  }
}

const signup = new authController().signup;
const signin = new authController().signin;
const signout = new authController().signout;
const requireSignin = new authController().requireSignin;
export { signup, signin, signout, requireSignin };
