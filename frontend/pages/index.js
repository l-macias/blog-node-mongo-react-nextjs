import Layout from "../components/Layout";
import Link from "next/link";

const Index = () => {
  return (
    <Layout>
      <h2>Inicio</h2>
      <Link href="/signup">
        <a>Registro</a>
      </Link>
    </Layout>
  );
};

export default Index;
