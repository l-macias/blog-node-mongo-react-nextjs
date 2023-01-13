import { useState } from "react";
import Link from "next/link";
import { emailContactForm } from "../../actions/form";

const ContactForm = ({ authorEmail }) => {
    const [values, setValues] = useState({
        message: "",
        name: "",
        email: "",
        sent: "false",
        buttonText: "Enviar Mensaje",
        success: false,
        error: false,
    });

    const { message, name, email, sent, buttonText, success, error } = values;

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, buttonText: "Enviando..." });
        emailContactForm({ authorEmail, name, email, message }).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    sent: true,
                    name: "",
                    email: "",
                    message: "",
                    buttonText: "Enviado",
                    success: data.success,
                });
            }
        });
    };
    const handleChange = (name) => (e) => {
        setValues({
            ...values,
            [name]: e.target.value,
            error: false,
            success: false,
            buttonText: "Enviar Mensaje",
        });
    };

    const showSuccessMessage = () =>
        success && (
            <div className="alert alert-info">
                Gracias por contactarte con nosotros.
            </div>
        );

    const showErrorMessage = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const contactForm = () => {
        return (
            <form onSubmit={clickSubmit} className="pb-5">
                <div className="form-group">
                    <label className="lead">Mensaje</label>
                    <textarea
                        onChange={handleChange("message")}
                        type="text"
                        className="form-control"
                        value={message}
                        rows="10"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label className="lead">Nombre</label>
                    <input
                        type="text"
                        onChange={handleChange("name")}
                        className="form-control"
                        value={name}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="lead">Email</label>
                    <input
                        type="email"
                        onChange={handleChange("email")}
                        className="form-control"
                        value={email}
                        required
                    />
                </div>
                <div>
                    <button className="btn btn-primary mt-3">
                        {buttonText}
                    </button>
                </div>
            </form>
        );
    };
    return (
        <>
            {showSuccessMessage()}
            {showErrorMessage()}
            {contactForm()}
        </>
    );
};
export default ContactForm;
