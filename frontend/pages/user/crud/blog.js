import Layout from "../../../components/Layout";
import Link from "next/link";
import Private from "../../../components/auth/Private";
import BlogCreate from "../../../components/crud/BlogCreate";

const CreateBlog = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Crear un Nuevo Blog</h2>
                        </div>

                        <div className="col-md-12">
                            <BlogCreate />
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default CreateBlog;