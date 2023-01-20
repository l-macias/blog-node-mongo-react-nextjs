import Link from "next/link";

import { Parser } from "html-to-react";
import moment from "moment";
import "moment/locale/es";
import { API } from "../../config";
moment.locale("es");

const SmallCard = ({ blog }) => {
    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img
                            className="img-fluid"
                            style={{ maxHeight: "400px", width: "100%" }}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a className="anchor-clean">
                            <h5 className="card-title text-center">
                                {blog.title}
                            </h5>
                            <hr />
                        </a>
                    </Link>
                    <div className="card-text">
                        {" "}
                        {Parser().parse(blog.excerpt)}
                    </div>
                </section>
            </div>

            <div className="card-body">
                Escrito {moment(blog.updatedAt).fromNow()} por{" "}
                <Link href={`/profile/${blog.postedBy.username}`}>
                    <a className="anchor-clean">{blog.postedBy.username}</a>
                </Link>
            </div>
        </div>
    );
};

export default SmallCard;
