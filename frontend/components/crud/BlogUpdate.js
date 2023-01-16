import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tags";
import { singleBlog, updateBlog } from "../../actions/blog";
import { quillModules, quillFormats } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { API } from "../../config";

import "../../node_modules/quill/dist/quill.snow.css";

const BlogUpdate = ({ router }) => {
    const [body, setBody] = useState("");

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCat, setCheckedCat] = useState([]); // categories
    const [checkedTag, setCheckedTag] = useState([]); // tags

    const [values, setValues] = useState({
        title: "",
        error: "",
        success: "",
        formData: "",
        title: "",
        body: "",
    });

    const { error, success, formData, title } = values;
    const token = getCookie("token");
    useEffect(() => {
        setValues({ ...values, formData: new FormData() });
        initBlog();
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

    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input
                        onChange={handleToggleCat(c._id)}
                        checked={findOutCategory(c._id)}
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
                        checked={findOutTag(t._id)}
                        className="mr-2"
                        type="checkbox"
                    ></input>
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        );
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

    const findOutCategory = (c) => {
        const result = checkedCat.indexOf(c);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const findOutTag = (t) => {
        const result = checkedTag.indexOf(t);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setValues({
                        ...values,
                        formData: new FormData(),
                        title: data.title,
                    });
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            });
        }
    };

    const setCategoriesArray = (blogCategories) => {
        let ca = [];
        blogCategories.map((c, i) => {
            ca.push(c._id);
        });
        setCheckedCat(ca);
    };

    const setTagsArray = (blogTags) => {
        let ta = [];
        blogTags.map((t, i) => {
            ta.push(t._id);
        });
        setCheckedTag(ta);
    };
    const handleBody = (e) => {
        setBody(e);
        formData.set("body", e);
    };

    const editBlog = (e) => {
        e.preventDefault();

        updateBlog(formData, token, router.query.slug).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    title: "",
                    success: `El post Titulado "${data.title}" ha sido actualizado correctamente`,
                });
                if (isAuth() && isAuth().role === 1) {
                    Router.replace(`/admin/crud/blogs`);
                } else if (isAuth() && isAuth().role === 0) {
                    Router.replace(`/user`);
                }
            }
        });
    };

    const showError = () => {
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>;
    };
    const showSuccess = () => {
        <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
        >
            {success}
        </div>;
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

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
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
                        modules={quillModules}
                        formats={quillFormats}
                        value={body}
                        placeholder="Escribe algo increíble..."
                        onChange={handleBody}
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary ">
                        Actualizar
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}

                    <div className="pt-3">
                        {showSuccess()}
                        {showError()}
                        <hr />
                    </div>
                    {body && (
                        <img
                            src={`${API}/blog/photo/${router.query.slug}`}
                            alt={title}
                            style={{ width: "100%" }}
                        />
                    )}
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
export default withRouter(BlogUpdate);
