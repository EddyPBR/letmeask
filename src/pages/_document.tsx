import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Facebook */}
          <meta property="og:url"           content="https://letmeask-virid.vercel.app/" />
          <meta property="og:type"          content="website" />
          <meta property="og:title"         content="Letmeask" />
          <meta property="og:description"   content="Sistema de ranqueamento de perguntas para lives!" />
          <meta property="og:image"         content="https://letmeask-virid.vercel.app/letmeask.jpg" />
          
          {/* Google fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Roboto:wght@400;500&display=swap"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          <meta name="theme-color" content="#835AFD" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
