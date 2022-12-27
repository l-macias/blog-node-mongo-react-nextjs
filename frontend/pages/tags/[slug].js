import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import parse from "html-react-parser"; //chequear si funciona y parsea codigo html
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import { singleTag } from "../../actions/tags";
import Card from "../../components/blog/Card";
const Tag = ({ tag, blogs }) => {
  return (
    <>
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
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
Tag.getInitialProps = async ({ query }) => {
  const data = await singleTag(query.slug);
  if (data.error) {
    console.log(data.error);
  } else {
    return { tag: data.tag, blogs: data.blogs };
  }
};

export default Tag;
