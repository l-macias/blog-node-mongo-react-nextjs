import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header"), {
    ssr: false,
});
const Footer = dynamic(() => import("./Footer"), {
    ssr: false,
});
const Layout = ({ children }) => {
    return (
        <>
            <Header />

            {children}
            <Footer />
        </>
    );
};

export default Layout;
