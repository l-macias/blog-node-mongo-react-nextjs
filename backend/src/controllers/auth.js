import { User } from "../models/user.js";
import shortId from "shortid";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import _ from "lodash";
import { Blog } from "../models/blog.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import { OAuth2Client } from "google-auth-library";
import transporter from "../helpers/nodeMailer.js";
import dotenv from "dotenv";
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthController {
    constructor() {}

    preSignup(req, res) {
        try {
            const { name, email, password } = req.body;
            User.findOne({ email: email.toLowerCase() }, (err, user) => {
                if (user) {
                    return res.status(400).json({
                        error: "El email ya se encuentra registrado",
                    });
                }
                const token = jwt.sign(
                    { name, email, password },
                    process.env.JWT_ACC_ACTIVATION,
                    { expiresIn: "10m" }
                );

                const msg = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Activar la cuenta - ${process.env.APP_NAME}`,

                    html: `
                        
                        <p>Use el siguiente link para activar tu cuenta:</p>
                        <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                        
                        <hr/>
                        <p>Este correo puede contener información importante y privada</p>
                        <p>https://nombredemipagina.com</p>
    
    
                    `,
                };
                transporter.sendMail(msg);
                return res.json({
                    message: `El Correo ha sido enviado a ${email} \n Siga las instrucciones para Activar su cuenta. El link expira en 10 minutos`,
                    success: true,
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    // signup(req, res) {
    //     try {
    //         User.findOne({ email: req.body.email }).exec((err, user) => {
    //             if (user) {
    //                 return res.status(400).json({
    //                     error: "Ese Correo ya ha sido registrado",
    //                 });
    //             }
    //             const { name, email, password } = req.body;
    //             let username = shortId.generate();
    //             let profile = `${process.env.CLIENT_URL}/profile/${username}`; //RARO- VER
    //             let newUser = new User({
    //                 name,
    //                 email,
    //                 password,
    //                 profile,
    //                 username,
    //             });

    //             newUser.save((err, success) => {
    //                 if (err) {
    //                     return res.status(400).json({
    //                         error: err,
    //                     });
    //                 }
    //                 res.json({
    //                     message: "Registro exitoso!. Por favor inicie sesión",
    //                 });
    //             });
    //         });
    //     } catch (error) {
    //         console.log(`Error en signup: ${error}`);
    //     }
    // }
    signup(req, res) {
        try {
            const token = req.body.token;
            if (token) {
                jwt.verify(
                    token,
                    process.env.JWT_ACC_ACTIVATION,
                    (err, decoded) => {
                        if (err) {
                            return res.status(401).json({
                                error: "El link ha expirado. Por favor intente crear la cuenta nuevamente",
                            });
                        }
                        const { name, email, password } = jwt.decode(token);
                        let username = shortId.generate();
                        let profile = `${process.env.CLIENT_URL}/profile/${username}`; //RARO- VER
                        let newUser = new User({
                            name,
                            email,
                            password,
                            profile,
                            username,
                        });
                        newUser.save((err, success) => {
                            if (err) {
                                return res.status(400).json({
                                    error: errorHandler(err),
                                });
                            }
                            return res.json({
                                message:
                                    "Registro exitoso!. Por favor inicie sesión",
                            });
                        });
                    }
                );
            } else {
                return res.json({
                    message: "Algo salió mal. Por favor intente nuevamente",
                });
            }
        } catch (error) {
            console.log(error);
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
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d",
                    }
                );
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
        // try {
        //   const token = req.headers.cookie
        //     ? req.headers.cookie.split("=")[1]
        //     : null;

        //   if (!token) {
        //     return res.status(400).json({
        //       error: "Acceso denegado",
        //     });
        //   }
        //   const user = jwt.verify(token, process.env.JWT_SECRET);
        //   req.user = user;
        // next();

        expressjwt({
            secret: process.env.JWT_SECRET,
            algorithms: ["HS256"],
            userProperty: "auth",
        });

        next();
        // } catch (error) {
        //   console.log(`Error en requireSignin: ${error}`);
        // }
    }
    authMiddleware(req, res, next) {
        try {
            let token = req.headers.authorization;
            token = token.replace("Bearer ", "");
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log(`JWT: ${err.message}`);
                    return res
                        .status(401)
                        .json({ status: false, error: "Token no es válido" });
                }
                req.user = decoded;
            });
            const authUserId = req.user._id;
            User.findById({ _id: authUserId }).exec((err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: "Usuario no encontrado",
                    });
                }
                req.profile = user;
                next();
            });
        } catch (error) {}
    }

    adminMiddleware(req, res, next) {
        let token;
        if (req.headers.authorization != undefined) {
            token = req.headers.authorization;
            token = token.replace("Bearer ", "");
        } else {
            token = req.cookies.token;
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(`JWT: ${err.message}`);
                return res
                    .status(401)
                    .json({ status: false, error: "Token no es válido" });
            }
            req.user = decoded;
        });
        const adminUserId = req.user._id;

        User.findById({ _id: adminUserId }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "Usuario no encontrado",
                });
            }

            if (user.role !== 1) {
                return res.status(400).json({
                    error: "Acceso denegado, no tienes permiso para ver esto.",
                });
            }
            req.profile = user;

            next();
        });
    }
    canUpdateDeleteBlog = (req, res, next) => {
        const slug = req.params.slug.toLowerCase();
        Blog.findOne({ slug }).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            let authorizedUser =
                data.postedBy._id.toString() === req.profile._id.toString();
            if (!authorizedUser) {
                return res.status(400).json({
                    error: "No estás autorizado",
                });
            }
            next();
        });
    };
    forgotPassword = (req, res) => {
        try {
            const { email } = req.body;
            User.findOne({ email }, (err, user) => {
                if (err || !user) {
                    return res.status(401).json({
                        error: "No existe usuario con ese email",
                    });
                }
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_RESET_PASSWORD,
                    { expiresIn: "10m" }
                );
                const msg = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Restablecer su Contraseña - ${process.env.APP_NAME}`,

                    html: `
                        
                        <p>Use el siguiente link para restablecer su contraseña:</p>
                        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        
                        <hr/>
                        <p>Este correo puede contener información importante y privada</p>
                        <p>https://nombredemipagina.com</p>
    
    
                    `,
                };
                return user.updateOne(
                    { resetPasswordLink: token },
                    (err, success) => {
                        if (err) {
                            return res.json({ error: errorHandler(err) });
                        } else {
                            const info = transporter.sendMail(msg);
                            return res.json({
                                message: `El Correo ha sido enviado a ${email} \n Siga las instrucciones para restablecer su contraseña. El link expira en 10 minutos`,
                                success: true,
                            });
                        }
                    }
                );
            });
        } catch (error) {}
    };
    resetPassword = (req, res) => {
        try {
            const { resetPasswordLink, newPassword } = req.body;
            if (resetPasswordLink) {
                jwt.verify(
                    resetPasswordLink,
                    process.env.JWT_RESET_PASSWORD,
                    function (err, decoded) {
                        if (err) {
                            return res.status(401).json({
                                error: "El link ha expirado, intente de nuevo",
                            });
                        }
                        User.findOne({ resetPasswordLink }, (err, user) => {
                            if (err || !user) {
                                return res.status(401).json({
                                    error: "Algo ha salido mal",
                                });
                            }
                            const updatedFields = {
                                password: newPassword,
                                resetPasswordLink: "",
                            };
                            user = _.extend(user, updatedFields);

                            user.save((err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err),
                                    });
                                }
                                res.json({
                                    message: `¡Genial! Ahora puedes iniciar sesión con tu nueva contraseña`,
                                });
                            });
                        });
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    googleLogin = async (req, res) => {
        const idToken = req.body.user.tokenId;
        // console.log(`EL PUTO ID TOKEN${JSON.stringify(req.body)}`);
        await client
            .verifyIdToken({
                idToken,
                requiredAudience: process.env.GOOGLE_CLIENT_ID,
            })
            .then((response) => {
                console.log(response);
                const { email_verified, name, email, jti } = response.payload;
                if (email_verified) {
                    User.findOne({ email }).exec((err, user) => {
                        if (user) {
                            const token = jwt.sign(
                                { _id: user._id },
                                process.env.JWT_SECRET,
                                { expiresIn: "1d" }
                            );
                            res.cookie("token", token, { expiresIn: "1d" });
                            const { _id, email, name, role, username } = user;
                            return res.json({
                                token,
                                user: { _id, email, name, role, username },
                            });
                        } else {
                            let username = shortId.generate();
                            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                            let password = jti + process.env.JWT_SECRET;
                            user = new User({
                                name,
                                email,
                                profile,
                                username,
                                password,
                            });
                            user.save((err, data) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err),
                                    });
                                }
                                const token = jwt.sign(
                                    { _id: data._id },
                                    process.env.JWT_SECRET,
                                    { expiresIn: "1d" }
                                );
                                res.cookie("token", token, { expiresIn: "1d" });
                                const { _id, email, name, role, username } =
                                    data;
                                return res.json({
                                    token,
                                    user: { _id, email, name, role, username },
                                });
                            });
                        }
                    });
                } else {
                    return res.status(400).json({
                        error: "Fallo el inicio de sesión con Google. Intenta nuevamente",
                    });
                }
            });
    };
}
const preSignup = new AuthController().preSignup;
const signup = new AuthController().signup;
const signin = new AuthController().signin;
const signout = new AuthController().signout;
const requireSignin = new AuthController().requireSignin;
const canUpdateDeleteBlog = new AuthController().canUpdateDeleteBlog;
const authMiddleware = new AuthController().authMiddleware;
const adminMiddleware = new AuthController().adminMiddleware;
const resetPassword = new AuthController().resetPassword;
const forgotPassword = new AuthController().forgotPassword;
const googleLogin = new AuthController().googleLogin;
export {
    preSignup,
    signup,
    signin,
    signout,
    requireSignin,
    authMiddleware,
    adminMiddleware,
    canUpdateDeleteBlog,
    resetPassword,
    forgotPassword,
    googleLogin,
};
