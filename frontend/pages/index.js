import Layout from "../components/Layout";
import Link from "next/link";
import { APP_NAME } from "../config";
const Index = () => {
    return (
        <Layout>
            <div className="overflow-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h1 className="display-4 font-weight-bold">
                                {`${APP_NAME}`}
                            </h1>
                            <h2>contenido original y de calidad</h2>

                            <br />
                            <h5 className="mb-3">
                                Soluciones a tus problemas, diversas formas de
                                conseguir dinero a través de internet,
                                tutoriales de todo tipo, y mucho mas.
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-3 mb-3">
                <div className="row">
                    <div className="col-md-4">
                        <div className="flip flip-horizontal">
                            <div
                                className="front"
                                style={{
                                    backgroundImage:
                                        "url(" +
                                        "https://img.freepik.com/free-vector/background-abstract-line-digital-gradient-style_483537-2263.jpg" +
                                        ")",
                                }}
                            >
                                <h2 className="text-shadow text-center h1">
                                    Soluciones
                                </h2>
                            </div>
                            <div className="back text-center">
                                <Link href="/categories/soluciones">
                                    <a className="back-title__card">
                                        <h3 className="h1 ">Soluciones</h3>
                                    </a>
                                </Link>
                                <p className="lead">
                                    Las soluciones que estás buscando
                                    relacionadas con el mundo de la tecnología.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="flip flip-horizontal">
                            <div
                                className="front"
                                style={{
                                    backgroundImage:
                                        "url(" +
                                        "https://img.freepik.com/free-vector/background-abstract-line-digital-gradient-style_483537-2263.jpg" +
                                        ")",
                                }}
                            >
                                <h2 className="text-shadow text-center h1 ">
                                    Negocios
                                </h2>
                            </div>
                            <div className="back text-center">
                                <Link href="/categories/negocios">
                                    <a className="back-title__card">
                                        <h3 className="h1 ">Negocios</h3>
                                    </a>
                                </Link>
                                <p className="lead">
                                    Si quieres ganar dinero por internet, este
                                    es tu lugar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="flip flip-horizontal">
                            <div
                                className="front"
                                style={{
                                    backgroundImage:
                                        "url(" +
                                        "https://img.freepik.com/free-vector/background-abstract-line-digital-gradient-style_483537-2263.jpg" +
                                        ")",
                                }}
                            >
                                <h2 className="text-shadow text-center h1 ">
                                    Tutoriales
                                </h2>
                            </div>
                            <div className="back text-center">
                                <Link href="/categories/tutoriales">
                                    <a className="back-title__card">
                                        <h3 className="h1 ">Tutoriales</h3>
                                    </a>
                                </Link>
                                <p className="lead">
                                    Tutoriales paso a paso para que puedas
                                    realizar tus proyectos desde cero.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Index;
