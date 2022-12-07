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
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import "../../node_modules/quill/dist/quill.snow.css";

const BlogUpdate = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <p>Crear Formulario de Post</p>
          <div className="pt-3">
            <p>Mostrar mensajes de error y exito</p>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Imagen destacada</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogUpdate;
