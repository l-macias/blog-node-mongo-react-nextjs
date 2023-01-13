import { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import Router from "next/router";
import Link from "next/link";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "./LoginGoogle";
const SigninComponent = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        message: "",
        showForm: true,
    });

    const { email, password, error, loading, message, showForm } = values;

    useEffect(() => {
        isAuth() && Router.push(`/`);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.table({ name, email, password, error, loading, message, showForm });
        setValues({ ...values, loading: true, error: false });
        const user = { email, password };

        signin(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push(`/admin`);
                    } else {
                        Router.push(`/user`);
                    }
                });
            }
        });
    };

    const handleChange = (name) => (e) => {
        setValues({ ...values, error: false, [name]: e.target.value });
    };

    const showLoading = () =>
        loading ? <div className="alert alert-info">Cargando...</div> : "";
    const showError = () =>
        error ? <div className="alert alert-danger">{error}</div> : "";
    const showMessage = () =>
        message ? <div className="alert alert-info">{message}</div> : "";

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        value={email}
                        onChange={handleChange("email")}
                        type="email"
                        className="form-control"
                        placeholder="Ingresa tu Email"
                    />
                </div>

                <div className="form-group">
                    <input
                        value={password}
                        onChange={handleChange("password")}
                        type="password"
                        className="form-control"
                        placeholder="Ingresa tu Contraseña"
                    />
                </div>

                <div>
                    <button className="btn btn-primary">Iniciar Sesión</button>
                </div>
            </form>
        );
    };

    return (
        <>
            {showError()}
            {showLoading()}
            {showMessage()}
            <GoogleOAuthProvider clientId="191817899983-7md9lgabkaiv1105m0bsjsle3to2336n.apps.googleusercontent.com">
                <LoginGoogle />
            </GoogleOAuthProvider>
            {showForm && signinForm()}
            <br />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-sm">
                    Olvide mi contraseña
                </a>
            </Link>
        </>
    );
};

export default SigninComponent;
