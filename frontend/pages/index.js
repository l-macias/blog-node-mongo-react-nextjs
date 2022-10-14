import Layout from "../components/Layout";
import Link from "next/link";
import Head from "next/head";

const Index = () => {
  return (
    <Layout>
      <h2>Página de inicio</h2>
      <Link href="/signup">
        <a>Registro</a>
      </Link>
    </Layout>
  );
};

export default Index;
