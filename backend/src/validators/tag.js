import { check } from "express-validator";

export const tagCreateValidator = [
  check("name").not().isEmpty().withMessage("El nombre es requerido"),
];
