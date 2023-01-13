import express from "express";
import {
    signup,
    signin,
    signout,
    requireSignin,
    resetPassword,
    forgotPassword,
    preSignup,
    googleLogin,
} from "../controllers/auth.js";

const routerAuth = express.Router();

//Validators
import { runValidation } from "../validators/index.js";
import {
    userSignupValidator,
    userSigninValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from "../validators/auth.js";

routerAuth.post("/pre-signup", userSignupValidator, runValidation, preSignup);
routerAuth.post("/signup", signup);
routerAuth.post("/signin", userSigninValidator, runValidation, signin);
routerAuth.get("/signout", signout);
//test
routerAuth.get("/secret", requireSignin, (req, res) => {
    res.json({
        user: req.user,
        cookies: req.headers.cookie,
    });
});
routerAuth.put(
    "/forgot-password",
    runValidation,
    forgotPassword,
    resetPasswordValidator
);

routerAuth.put(
    "/reset-password",
    runValidation,
    forgotPasswordValidator,
    resetPassword
);
// GOOGLE LOGIN
routerAuth.post("/google-login", googleLogin);
export default routerAuth;
