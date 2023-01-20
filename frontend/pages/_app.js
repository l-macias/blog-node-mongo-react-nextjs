import React from "react";
import Head from "next/head";
import "../node_modules/react-quill/dist/quill.snow.css";
function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="viewport-fit=cover" />
                <link rel="stylesheet" href="/static/css/styles.css" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
