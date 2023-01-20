import Layout from "../../components/Layout";

import Link from "next/link";
import Admin from "../../components/auth/Admin";

const AdminIndex = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Panel de Administrador</h2>
                        </div>

                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a className="anchor-clean">
                                            Crear Categorías
                                        </a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a className="anchor-clean">
                                            Crear TAGS
                                        </a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/blog">
                                        <a className="anchor-clean">
                                            Crear Post
                                        </a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/admin/crud/blogs">
                                        <a className="anchor-clean">
                                            Actualizar/Eliminar Post
                                        </a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/update">
                                        <a className="anchor-clean">
                                            Actualizar Perfil
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default AdminIndex;
