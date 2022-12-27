import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import parse from "html-react-parser"; //chequear si funciona y parsea codigo html
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import { singleCategory } from "../../actions/category";
import Card from "../../components/blog/Card";
const Category = ({ category, blogs }) => {
  return (
    <>
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                {blogs.map((b, i) => (
                  <div>
                    {" "}
                    <Card key={i} blog={b} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};
Category.getInitialProps = async ({ query }) => {
  const data = await singleCategory(query.slug);
  if (data.error) {
    console.log(data.error);
  } else {
    return { category: data.category, blogs: data.blogs };
  }
};

export default Category;
