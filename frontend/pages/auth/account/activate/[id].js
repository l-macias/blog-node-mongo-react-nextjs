import { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { signup } from "../../../../actions/auth";
import jwt from "jsonwebtoken";
import { Button } from "reactstrap";

const ActivateAccount = ({ router }) => {
    const [values, setValues] = useState({
        name: "",
        token: "",
        error: "",
        loading: false,
        success: false,
        showButton: true,
    });
    const { name, token, error, loading, success, showButton } = values;
    useEffect(() => {
        let token = router.query.id;
        if (token) {
            const { name } = jwt.decode(token);
            setValues({ ...values, name, token });
        }
    }, [router]);

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true, error: false });
        signup({ token }).then((data) => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false,
                    showButton: false,
                });
            } else {
                setValues({
                    ...values,
                    loading: false,
                    success: true,
                    showButton: false,
                });
            }
        });
    };
    const showLoading = () => (loading ? <h2>Cargando...</h2> : "");
    return (
        <Layout>
            <div className="container">
                <h3>Hola {name}, Estás listo para activar tu cuenta?</h3>
                {showLoading()}
                {error && error}
                {success &&
                    "Has activado correctamente tu cuenta. Por favor inicia sesión"}
                {showButton && (
                    <button
                        className="btn btn-outline-primary"
                        onClick={clickSubmit}
                    >
                        Activar cuenta
                    </button>
                )}
            </div>
        </Layout>
    );
};

export default withRouter(ActivateAccount);
