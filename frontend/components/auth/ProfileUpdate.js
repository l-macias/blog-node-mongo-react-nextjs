import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { getProfile, update } from "../../actions/user";
import { API } from "../../config";
const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: "",
        username_for_photo: "",
        name: "",
        email: "",
        password: "",
        about: "",
        error: false,
        succes: false,
        loading: false,
        photo: "",
        userData: typeof window !== "undefined" && new FormData(),
    });
    const token = getCookie("token");
    const {
        username,
        username_for_photo,
        name,
        email,
        password,
        error,
        success,
        loading,
        photo,
        userData,
        about,
    } = values;
    const init = () => {
        getProfile(token).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    username: data.username,
                    username_for_photo: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about,
                });
            }
        });
    };

    useEffect(() => {
        init();
        setValues({ ...values, userData: new FormData() });
    }, []);

    const handleChange = (name) => (e) => {
        const value = name === "photo" ? e.target.files[0] : e.target.value;
        // if (typeof window !== "undefined") {
        //     if (name != "photo") {
        //         //Guardamos en el LocalStorage el contenido del evento
        //         localStorage.setItem("title", JSON.stringify(e.target.value));
        //     }
        // }

        userData.set(name, value);

        setValues({
            ...values,
            [name]: value,
            userData: userData,
            error: false,
            success: false,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true });

        update(token, userData).then((data) => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false,
                });
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        password: "",
                        success: true,
                        loading: false,
                    });
                });
            }
        });
    };
    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="btn btn-outline-info ">
                    Modificar Foto de Perfil
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        accept="image/*"
                        hidden
                    />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Nombre de Usuario</label>
                <input
                    onChange={handleChange("username")}
                    type="text"
                    value={username}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Nombre</label>
                <input
                    onChange={handleChange("name")}
                    type="text"
                    value={name}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange("email")}
                    type="text"
                    value={email}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Sobre Mi</label>
                <textarea
                    onChange={handleChange("about")}
                    type="text"
                    value={about}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Contraseña</label>
                <input
                    onChange={handleChange("password")}
                    type="password"
                    value={password}
                    className="form-control"
                />
            </div>
            <div>
                <button type="submit" className="btn btn-primary mt-3">
                    Enviar
                </button>
            </div>
        </form>
    );

    const showError = () => {
        <div className="alert-danger" style={{ display: error ? "" : none }}>
            Todos los campos son requeridos
        </div>;
    };
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <img
                            src={`${API}/user/photo/${username_for_photo}`}
                            className="img img-fluid img-thumbnail mb-3"
                            style={{ maxHeight: "auto", maxWidth: "100%" }}
                            alt="Foto de perfil del usuario"
                        />
                    </div>
                    <div className="col-md-8 mb-5">
                        {/* {showSuccess()}
                        {showError()}
                        {showLoading()} */}
                        {profileUpdateForm()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileUpdate;
