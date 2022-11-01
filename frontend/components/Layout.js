// import Header from "./Header";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("./header"), {
  ssr: false,
});
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
