import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <>
            <footer className="text-black py-4 bg-footer mt-3">
                <div className="container-fluid ">
                    <nav className="row d-flex justify-content-center ">
                        <Link href="/" className="d-flex ">
                            <img
                                src="/static/images/logo.jpg"
                                className=" mx-3 mt-2 col-3 px-md-5  col-md-2 mb-2 img-fluid "
                                alt="Logo de AYUDAMeLOCO"
                            />
                        </Link>
                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Categorías
                            </li>
                            <li className="text-center">
                                <Link href="/categories/soluciones">
                                    <a className="anchor-clean"> Soluciones</a>
                                </Link>
                            </li>
                            <li className="text-center">
                                <Link href="/categories/negocios">
                                    <a className="anchor-clean"> Negocios</a>
                                </Link>
                            </li>
                            <li className="text-center">
                                <Link href="/categories/tutoriales">
                                    <a className="anchor-clean"> Tutoriales</a>
                                </Link>
                            </li>
                        </ul>

                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Ver artículos
                            </li>
                            <li className="text-center">
                                <Link href="/blogs">
                                    <a className="anchor-clean"> Ver Todos</a>
                                </Link>
                            </li>
                        </ul>
                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Contacto
                            </li>
                            <li className="text-center">
                                <Link href="/contact">
                                    <a className="anchor-clean"> Contacto</a>
                                </Link>
                            </li>
                        </ul>
                        <ul className="col-12 col-md-2 list-unstyled">
                            <li className="font-weight-bold mb-2 text-center h3">
                                Sesión
                            </li>
                            <li className="text-center">
                                <Link href="/signin">
                                    <a className="anchor-clean">
                                        Iniciar Sesión
                                    </a>
                                </Link>
                            </li>
                            <li className="text-center">
                                <Link href="/signup">
                                    <a className="anchor-clean">Registro</a>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </>
    );
};

export default Footer;
