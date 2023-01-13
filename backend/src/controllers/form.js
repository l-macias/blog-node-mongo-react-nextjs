import transporter from "../helpers/nodeMailer.js";
import dotenv from "dotenv";
dotenv.config();

class FormController {
    constructor() {}

    async contactForm(req, res) {
        try {
            const { email, name, message } = req.body;
            const msg = {
                to: process.env.EMAIL_TO,
                from: process.env.EMAIL_TO,
                subject: `Formulario de contacto - ${process.env.APP_NAME}`,
                text: `Email recibido desde el formulario de contacto de\n Remitente: ${name} \n Email: ${email}\n Mensaje enviado: \n ${message}`,
                html: `
                    <h4>Email recibido desde el formulario de contacto</h4>
                    <p>Nombre: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Mensaje: ${message}</p>
                    <hr/>
                    <p>Este correo puede contener información importante y privada</p>
                    <p>https://nombredemipagina.com</p>


                `,
            };
            const info = await transporter.sendMail(msg);

            return res.json({ success: true });
        } catch (error) {
            console.log(error);
        }
    }
    async contactBlogAuthorForm(req, res) {
        try {
            const { authorEmail, email, name, message } = req.body;
            let mailList = [authorEmail, process.env.EMAIL_TO];
            const msg = {
                to: mailList,
                from: email,
                subject: `Has recibido un mensaje de: - ${process.env.APP_NAME}`,
                text: `Email recibido desde el formulario de contacto de\n Remitente: ${name} \n Email: ${email}\n Mensaje enviado: \n ${message}`,
                html: `
                    <h4>Mensaje recibido de: </h4>
                    <p>Nombre: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Mensaje: ${message}</p>
                    <hr/>
                    <p>Este correo puede contener información importante y privada</p>
                    <p>https://nombredemipagina.com</p>


                `,
            };
            const info = await transporter.sendMail(msg);
            return res.json({ success: true });
        } catch (error) {
            console.log(error);
        }
    }
}

const contactForm = new FormController().contactForm;
const contactBlogAuthorForm = new FormController().contactBlogAuthorForm;
export { contactForm, contactBlogAuthorForm };
