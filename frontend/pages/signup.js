import Layout from "../components/Layout";
import Link from "next/link";
const Signup = () => {
  return (
    <Layout>
      <h2>Registro</h2>
      <Link href="/">
        <a>Inicio</a>
      </Link>
    </Layout>
  );
};

export default Signup;
