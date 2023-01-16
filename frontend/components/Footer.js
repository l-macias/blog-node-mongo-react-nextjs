import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <>
            <footer className="text-black py-4 bg-footer">
                <div className="container-fluid ">
                    <nav className="row d-flex justify-content-center ">
                        <Link href="/" className="d-flex ">
                            <img
                                src="/static/images/logo.jpg"
                                className=" mx-3 mt-2 col-6  col-md-1 mb-2 "
                                height="80"
                                alt="Logo de AYUDAMeLOCO"
                            />
                        </Link>
                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Categorías
                            </li>
                            <li className="text-center">
                                <Link href="/categories/soluciones">
                                    Soluciones
                                </Link>
                            </li>
                            <li className="text-center">
                                <Link href="/categories/negocios">
                                    Negocios
                                </Link>
                            </li>
                            <li className="text-center">
                                <Link href="/categories/tutoriales">
                                    Tutoriales
                                </Link>
                            </li>
                        </ul>

                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Ver artículos
                            </li>
                            <li className="text-center">
                                <Link href="/blogs">Ver Todos</Link>
                            </li>
                        </ul>
                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Contacto
                            </li>
                            <li className="text-center">
                                <Link href="/contact">Contacto</Link>
                            </li>
                        </ul>
                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Sesión
                            </li>
                            <li className="text-center">
                                <Link href="/signin">Iniciar sesión</Link>
                            </li>
                            <li className="text-center">
                                <Link href="/signup">Registro</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </>
    );
};

export default Footer;
