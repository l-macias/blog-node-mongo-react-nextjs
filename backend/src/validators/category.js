import { check } from "express-validator";

export const categoryCreateValidator = [
  check("name").not().isEmpty().withMessage("El nombre es requerido"),
];
