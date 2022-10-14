import { check } from "express-validator";

export const userSignupValidator = [
  check("name").not().isEmpty().withMessage("El nombre es requerido"),

  check("email").isEmail().withMessage("Debe ingresar un email válido"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
export const userSigninValidator = [
  check("email").isEmail().withMessage("Debe ingresar un email válido"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
