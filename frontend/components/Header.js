import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { APP_NAME } from "../config";
import { signout, isAuth } from "../actions/auth";
import nProgress from "nprogress";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import ".././node_modules/nprogress/nprogress.css";
import Search from "./blog/Search";

Router.onRouteChangeStart = (url) => nProgress.start();
Router.onRouteChangeComplete = (url) => nProgress.done();
Router.onRouteChangeError = (url) => nProgress.done();
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };
    const isServer = typeof window !== "undefined";
    return (
        <>
            {isServer && (
                <Navbar color="light" light expand="md">
                    <Link href="/">
                        <NavLink
                            className="font-weight-bold"
                            style={{ cursor: "pointer" }}
                        >
                            {`${APP_NAME}`}
                        </NavLink>
                    </Link>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ms-auto" navbar>
                            <>
                                <NavItem>
                                    <Link href="/blogs">
                                        <NavLink style={{ cursor: "pointer" }}>
                                            Posts
                                        </NavLink>
                                    </Link>
                                </NavItem>
                            </>

                            {!isAuth() && (
                                <>
                                    <NavItem>
                                        <Link href="/signin">
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                            >
                                                Iniciar Sesión
                                            </NavLink>
                                        </Link>
                                    </NavItem>
                                    <NavItem>
                                        <Link href="/signup">
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                            >
                                                Registro
                                            </NavLink>
                                        </Link>
                                    </NavItem>
                                </>
                            )}

                            {isAuth() && isAuth().role === 0 && (
                                <>
                                    <NavItem>
                                        <Link href="/user">
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                            >
                                                {`Panel de ${isAuth().name}`}
                                            </NavLink>
                                        </Link>
                                    </NavItem>
                                </>
                            )}
                            {isAuth() && isAuth().role === 1 && (
                                <>
                                    <NavItem>
                                        <Link href="/admin">
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                            >
                                                {`Panel de ${isAuth().name}`}
                                            </NavLink>
                                        </Link>
                                    </NavItem>
                                </>
                            )}
                            {isAuth() && (
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            signout(() =>
                                                Router.replace(`/signin`)
                                            )
                                        }
                                    >
                                        Cerrar Sesión
                                    </NavLink>
                                </NavItem>
                            )}
                            <NavItem>
                                <Link href="/contact">
                                    <NavLink style={{ cursor: "pointer" }}>
                                        Contacto
                                    </NavLink>
                                </Link>
                            </NavItem>
                            {isAuth() && (
                                <NavItem>
                                    <Link href="/user/crud/blog">
                                        <NavLink
                                            className="btn btn-primary text-light"
                                            style={{ cursor: "pointer" }}
                                        >
                                            Escribir un post
                                        </NavLink>
                                    </Link>
                                </NavItem>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            )}
            <Search />
        </>
    );
};

export default Header;
