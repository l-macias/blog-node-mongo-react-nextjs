import { check } from "express-validator";

export const contactFormValidator = [
    check("name").not().isEmpty().withMessage("El nombre es requerido"),
    check("email")
        .isEmail()
        .withMessage("El Email debe tener un formato válido"),
    check("message")
        .not()
        .isEmpty()
        .isLength({ min: 20 })
        .withMessage("El mensaje tiene que tener al menos 20 caracteres"),
];
