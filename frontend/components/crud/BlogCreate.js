import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tags";
import { createBlog } from "../../actions/blog";
import { quillModules, quillFormats } from "../../helpers/quill";
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill");
        const { default: BlotFormatter } = await import("quill-blot-formatter");
        RQ.Quill.register("modules/blotFormatter", BlotFormatter);
        return function forwardRef({ forwardedRef, ...props }) {
            return <RQ ref={forwardedRef} {...props} />;
        };
    },
    {
        ssr: false,
    }
);
import "../../node_modules/quill/dist/quill.snow.css";

const CreateBlog = ({ router }) => {
    const blogFromLS = () => {
        if (typeof window === "undefined") {
            return false;
        }
        if (localStorage.getItem("blog")) {
            return JSON.parse(localStorage.getItem("blog"));
        } else {
            return false;
        }
    };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCat, setCheckedCat] = useState([]); // categories
    const [checkedTag, setCheckedTag] = useState([]); //tags

    const [body, setBody] = useState(blogFromLS());

    const [values, setValues] = useState({
        error: "",
        sizeError: "",
        success: "",
        formData: "",
        title: "",
        hidePublishButton: false,
    });
    const { error, sizeError, success, formData, title, hidePublishButton } =
        values;

    const token = getCookie("token");
    useEffect(() => {
        setValues({ ...values, formData: new FormData() });
        initCategories();
        initTags();
    }, [router]);

    const initCategories = () =>
        getCategories().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });

    const initTags = () =>
        getTags().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setTags(data);
            }
        });

    const publishBlog = (e) => {
        e.preventDefault();
        createBlog(formData, token).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    title: "",
                    error: "",
                    success: `El post ${data.title} ha sido creado correctamente.\nSerás redirigido al menu anterior`,
                });
                //Limpiamos el body
                setBody("");
                setCategories([]);
                setTags([]);
                localStorage.removeItem("blog");
                localStorage.removeItem("title");
                setTimeout(() => {
                    Router.back();
                }, 1000);
            }
        });
    };

    const handleChange = (name) => (e) => {
        const value = name === "photo" ? e.target.files[0] : e.target.value;
        if (typeof window !== "undefined") {
            if (name != "photo") {
                //Guardamos en el LocalStorage el contenido del evento
                localStorage.setItem("title", JSON.stringify(e.target.value));
            }
        }
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: "" });
    };

    const handleBody = (e) => {
        setBody(e);
        formData.set("body", e);
        if (typeof window !== "undefined") {
            //Guardamos en el LocalStorage el contenido del evento
            localStorage.setItem("blog", JSON.stringify(e));
        }
    };

    const handleToggleCat = (c) => () => {
        setValues({ ...values, error: "" });
        //return the first index or -1
        const clickedCategory = checkedCat.indexOf(c);
        const all = [...checkedCat];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }

        setCheckedCat(all);
        formData.set("categories", all);
    };

    const handleToggleTag = (t) => () => {
        setValues({ ...values, error: "" });
        //return the first index or -1
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];

        if (clickedTag === -1) {
            all.push(t);
        } else {
            all.splice(clickedTag, 1);
        }

        setCheckedTag(all);
        formData.set("tags", all);
    };

    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input
                        onChange={handleToggleCat(c._id)}
                        type="checkbox"
                        className="mr-2"
                    ></input>
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const showTags = () => {
        return (
            tags &&
            tags.map((t, i) => (
                <li key={i} className="list-unstyled">
                    <input
                        onChange={handleToggleTag(t._id)}
                        className="mr-2"
                        type="checkbox"
                    ></input>
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        );
    };

    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showSuccess = () => (
        <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
        >
            {success}
        </div>
    );

    const createBlogForm = () => {
        const [enableEditor, setEnableEditor] = useState(false);
        const loadQuill = async () => {
            return new Promise(async (resolve, reject) => {
                const Quill = require("react-quill").Quill;
                const BlotFormatter = (await import("quill-blot-formatter"))
                    .default;
                resolve({ Quill, BlotFormatter });
            })
                .then(({ Quill, BlotFormatter }) => {
                    Quill.register("modules/blotFormatter", BlotFormatter);
                    return;
                })
                .then((value) => {
                    setEnableEditor(true);
                });
        };
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text">Titulo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={handleChange("title")}
                    />
                </div>

                <div className="form-group">
                    <ReactQuill
                        value={body}
                        placeholder=" Escribe aquí tu post..."
                        onChange={handleBody}
                        modules={quillModules}
                        formats={quillFormats}
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary mt-2">
                        Publicar
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <div className="form-group pb-2">
                            <h5>Imagen destacada</h5>
                            <hr />
                            <small className="text-muted ">
                                Tamaño máximo: 1mb
                            </small>
                            <label className="btn btn-outline-info mx-3">
                                Subir imagen
                                <input
                                    onChange={handleChange("photo")}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                        </div>
                    </div>
                    <div>
                        <h5>CATEGORIAS</h5>
                    </div>
                    <hr />
                    <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                        {showCategories()}
                    </ul>
                    <hr />
                    <div>
                        <h5>TAGS</h5>
                    </div>
                    <hr />
                    <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
                        {showTags()}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default withRouter(CreateBlog);
