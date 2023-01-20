import Link from "next/link";
import parse from "html-react-parser"; //chequear si funciona y parsea codigo html
import moment from "moment";
import "moment/locale/es";
import { API } from "../../config";
moment.locale("es");

const Card = ({ blog }) => {
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

    return (
        <div className="lead pb-4">
            <header>
                <hr />
                <Link href={`/blogs/${blog.slug}`}>
                    <a className="anchor-clean">
                        <h2 className=" pt-3">{blog.title}</h2>
                    </a>
                </Link>
            </header>

            <section>
                <p className="mark mx-1  ">
                    Escrito por{" "}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                        <a className="anchor-clean">{blog.postedBy.username}</a>
                    </Link>{" "}
                    | Publicado {moment(blog.updatedAt).fromNow()}
                </p>
            </section>

            <section className="pb-3">
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
            </section>

            <div className="row">
                <div className="col-md-4">
                    <section>
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: "auto", width: "100%" }}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </section>
                </div>
                <div className="col-md-8 mh-50">
                    <section>
                        <div className="pb-3 card cuadro ">
                            {parse(blog.excerpt)}
                        </div>
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-sm font-weight-bold btn-primary mt-2">
                                Leer Mas
                            </a>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Card;
