import express from "express";
import { signup, signin, signout, requireSignin } from "../controllers/auth.js";

const routerAuth = express.Router();

//Validators
import { runValidation } from "../validators/index.js";
import {
  userSignupValidator,
  userSigninValidator,
} from "../validators/auth.js";

routerAuth.post("/signup", userSignupValidator, runValidation, signup);
routerAuth.post("/signin", userSigninValidator, runValidation, signin);
routerAuth.get("/signout", signout);
//test
routerAuth.get("/secret", requireSignin, (req, res) => {
  res.json({
    user: req.user,
    cookies: req.headers.cookie,
  });
});

export default routerAuth;
