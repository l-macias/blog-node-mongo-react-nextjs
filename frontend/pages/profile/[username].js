import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { userPublicProfile } from "../../actions/user";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import ContactForm from "../../components/form/ContactForm";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const UserProfile = ({ user, blogs, query }) => {
    const head = () => {
        return (
            <Head>
                <title>
                    {user.username} | {APP_NAME}
                </title>
                <meta
                    name="description"
                    content={`Posts de ${user.username}`}
                />
                <link
                    rel="canonical"
                    href={`${DOMAIN}/profile/${query.username}`}
                />
                <meta
                    property="og:title"
                    content={` ${user.username} |${APP_NAME}`}
                />
                <meta
                    property="og:description"
                    content={`Posts de ${user.username}`}
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={`${DOMAIN}/profile/${query.username}`}
                />
                <meta property="og:site_name" content={`${APP_NAME}`} />
                <meta
                    property="og:image"
                    content={`${DOMAIN}/static/images/img.jpg`}
                />
                <meta
                    property="og:image:secure_url"
                    content={`${DOMAIN}/static/images/img.jpg`}
                />
                <meta property="og:image:type" content="image/jpg" />
                <meta property="fb:app_id" content={`${FB_APP_ID}`} />
            </Head>
        );
    };

    const showUserBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div className="mt-4 mb-4" key={i}>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a className="lead">{blog.title}</a>
                    </Link>
                </div>
            );
        });
    };

    return (
        <>
            {head()}
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h5>{user.name}</h5>

                                            <p className="text-muted">
                                                Se ha unido{" "}
                                                {moment(
                                                    user.createdAt
                                                ).fromNow()}
                                            </p>
                                        </div>
                                        <div className="col-md-4">
                                            <img
                                                src={
                                                    !user.username
                                                        ? ""
                                                        : `${API}/user/photo/${user.username}`
                                                }
                                                className="img img-fluid img-thumbnail mb-3"
                                                style={{
                                                    maxHeight: "200px",
                                                    maxWidth: "100%",
                                                }}
                                                alt="Foto de perfil del usuario"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <div className="container pb-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 pn-4 ps-4 text-light">
                                        Posts recientes de {user.name}
                                    </h5>

                                    {showUserBlogs()}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 pn-4 ps-4 text-light">
                                        Envia un mensaje a {user.name}
                                    </h5>
                                    <br />
                                    {<ContactForm authorEmail={user.email} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

UserProfile.getInitialProps = async ({ query }) => {
    const data = await userPublicProfile(query.username);
    if (data.error) {
        console.log(data.error);
    } else {
        return { user: data.user, blogs: data.blogs, query };
    }
};
export default UserProfile;
