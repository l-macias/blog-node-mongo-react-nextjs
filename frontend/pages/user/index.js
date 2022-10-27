import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <h2>Panel de Usuario</h2>
      </Private>
    </Layout>
  );
};

export default UserIndex;
