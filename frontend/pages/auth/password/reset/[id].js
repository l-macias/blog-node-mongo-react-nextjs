import { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { resetPassword } from "../../../../actions/auth";

const ResetPassword = ({ router }) => {
    const [values, setValues] = useState({
        name: "",
        newPassword: "",
        error: "",
        message: "",
        showForm: true,
    });
    const { name, newPassword, error, message, showForm } = values;
    const handleSubmit = (e) => {
        e.preventDefault();
        resetPassword({
            newPassword,
            resetPasswordLink: router.query.id,
        }).then((data) => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    showForm: false,
                    newPassword: "",
                });
            } else {
                setValues({
                    ...values,
                    message: data.message,
                    showForm: false,
                    error: false,
                    newPassword: "",
                });
            }
        });
    };

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group pt-5">
                <input
                    type="password"
                    onChange={(e) =>
                        setValues({ ...values, newPassword: e.target.value })
                    }
                    className="form-control"
                    value={newPassword}
                    placeholder="Escribe una Nueva Contraseña"
                    required
                />
            </div>
            <div>
                <button className="btn btn-primary">Cambiar Contraseña</button>
            </div>
        </form>
    );
    const showError = () =>
        error ? <div className="alert alert-danger">{error}</div> : "";
    const showMessage = () =>
        message ? <div className="alert alert-success">{message}</div> : "";
    return (
        <Layout>
            <div className="container">
                <h2>Resetear Contraseña</h2>
                <hr />
                {showError()}
                {showMessage()}
                {passwordResetForm()}
            </div>
        </Layout>
    );
};
export default withRouter(ResetPassword);
