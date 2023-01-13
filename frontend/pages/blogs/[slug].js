import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import parse from "html-react-parser"; //chequear si funciona y parsea codigo html
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import { singleBlog, listRelated } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import SmallCard from "../../components/blog/SmallCard";
import DisqusThread from "../../components/DisqusThread";

const SingleBlog = ({ blog, query }) => {
    const [related, setRelated] = useState([]);

    const loadRelated = () => {
        listRelated({ blog }).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                return setRelated(data);
            }
        });
    };

    useEffect(() => {
        loadRelated();
    }, []);
    const head = () => {
        return (
            <Head>
                <title>
                    {blog.title} | {APP_NAME}
                </title>
                <meta name="description" content={blog.mdesc} />
                <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
                <meta
                    property="og:title"
                    content={` ${blog.title} |${APP_NAME}`}
                />
                <meta property="og:description" content={blog.mdesc} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={`${DOMAIN}/blogs/${query.slug}`}
                />
                <meta property="og:site_name" content={`${APP_NAME}`} />
                <meta
                    property="og:image"
                    content={`${API}/blog/photo/${blog.slug}`}
                />
                <meta
                    property="og:image:secure_url"
                    content={`${API}/blog/photo/${blog.slug}`}
                />
                <meta property="og:image:type" content="image/jpg" />
                <meta property="fb:app_id" content={`${FB_APP_ID}`} />
            </Head>
        );
    };

    const showBlogCategories = (blog) => {
        return blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-primary mx-1 ms-1 mt-3">{c.name}</a>
            </Link>
        ));
    };

    const showBlogTags = (blog) => {
        return blog.tags.map((t, i) => (
            <Link key={i} href={`/tags/${t.slug}`}>
                <a className="btn btn-outline-primary mx-1 ms-1 mt-3">
                    {t.name}
                </a>
            </Link>
        ));
    };
    const showRelatedBlog = () => {
        return related.map((blog, i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        ));
    };
    const showComments = () => {
        return (
            <div>
                <DisqusThread
                    id={blog.id}
                    title={blog.title}
                    path={`/blog/${blog.slug}`}
                />
            </div>
        );
    };
    return (
        <>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div
                                    className="row"
                                    style={{ marginTop: "-30px" }}
                                >
                                    <img
                                        src={`${API}/blog/photo/${blog.slug}`}
                                        alt={blog.title}
                                        className="img img-fluid featured-image"
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="container">
                                    <h1 className="display-2 pb-3 pt-3 text-center font-weight-bold">
                                        {blog.title}
                                    </h1>
                                    <p className="lead mt-3 mark">
                                        Escrito por{" "}
                                        <Link
                                            href={`/profile/${blog.postedBy.username}`}
                                        >
                                            <a>{blog.postedBy.username}</a>
                                        </Link>{" "}
                                        |Publicado{" "}
                                        {moment(blog.updatedAt).fromNow()}
                                    </p>

                                    <div className="pb-3">
                                        {showBlogCategories(blog)}
                                        {showBlogTags(blog)}
                                        <br />
                                        <br />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="container">
                            <section>
                                <div className="col-md-12 lead">
                                    {parse(blog.body)}
                                </div>
                            </section>
                        </div>

                        <div className="container">
                            <h4 className="text-center pt-5 pb-5 h2">
                                Blogs Relacionados
                            </h4>
                            <div className="row">{showRelatedBlog()}</div>
                        </div>

                        <div className="container pt-5 pb-5">
                            {showComments()}
                        </div>
                    </article>
                </main>
            </Layout>
        </>
    );
};
SingleBlog.getInitialProps = async ({ query }) => {
    const data = await singleBlog(query.slug);

    if (data.error) {
    } else {
        return { blog: data, query };
    }
};
export default SingleBlog;
