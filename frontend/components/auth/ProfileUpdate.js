import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getProfile, update } from "../../actions/user";

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    about: "",
    error: false,
    succes: false,
    loading: false,
    photo: "",
    userData: "",
  });
  const token = getCookie("token");
  const {
    username,
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
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    if (typeof window !== "undefined") {
      if (name != "photo") {
        //Guardamos en el LocalStorage el contenido del evento
        localStorage.setItem("title", JSON.stringify(e.target.value));
      }
    }
    userData = new FormData();
    userData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      userData,
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
          success: false,
          loading: false,
        });
      } else {
        setValues({
          ...values,
          username: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
          success: true,
          loading: false,
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
          type="text"
          value={password}
          className="form-control"
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </div>
    </form>
  );
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4">imagen</div>
          <div className="col-md-8 mb-5">{profileUpdateForm()}</div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
