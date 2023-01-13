import Document, { Html, Head, Main, NextScript } from "next/document";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

class MyDocument extends Document {
    // ANALYTICS COMPLETAR
    setGoogleTags = () => {
        if (publicRuntimeConfig.PRODUCTION) {
            return {
                __html: `
      <!-- Global site tag (gtag.js) - Google Analytics 
      desde window.dataLayer hasta el id de gtag-->
      `,
            };
        }
    };

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
                    />
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                    />
                    <link rel="stylesheet" href="/static/css/styles.css" />
                    {/* Script Analytics */}
                    {/* <script async src="htt...googletagman"></script> */}
                    <script
                        dangerouslySetInnerHTML={this.setGoogleTags()}
                    ></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
