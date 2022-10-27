import Layout from "../../components/Layout";

import Link from "next/link";
import Admin from "../../components/auth/Admin";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <h2>Panel de Administrador</h2>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
