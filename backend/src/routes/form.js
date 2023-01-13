import express from "express";

import { runValidation } from "../validators/index.js";
import { contactFormValidator } from "../validators/form.js";
import { contactForm, contactBlogAuthorForm } from "../controllers/form.js";

const routerContact = express.Router();

routerContact.post(
    "/contact",
    contactFormValidator,
    runValidation,
    contactForm
);

routerContact.post(
    "/contact-blog-author",
    contactFormValidator,
    runValidation,
    contactBlogAuthorForm
);

export default routerContact;
