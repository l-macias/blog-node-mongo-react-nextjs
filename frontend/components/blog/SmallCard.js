import Link from "next/link";
import parse from "html-react-parser"; //chequear si funciona y parsea codigo html
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
              className="img img-fluid"
              style={{ maxHeight: "auto", width: "100%" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </Link>
      </section>
      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className="card-title">{blog.title}</h5>
            </a>
          </Link>
          <div className="card-text">{parse(blog.excerpt)}</div>
        </section>
      </div>

      <div className="card-body">
        Escrito {moment(blog.updatedAt).fromNow()} por{" "}
        <Link href={`/profile/${blog.postedBy.username}`}>
          <a>{blog.postedBy.username}</a>
        </Link>
      </div>
    </div>
  );
};

export default SmallCard;
