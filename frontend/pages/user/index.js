import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Panel de Usuario</h2>
            </div>

            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/user/crud/blog">
                    <a>Crear Post</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="/user/crud/blogs">
                    <a>Actualizar/Eliminar Post</a>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="/user/update">
                    <a>Actualizar Perfil</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;
