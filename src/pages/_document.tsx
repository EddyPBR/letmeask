import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          <link rel="manifest" href="/manifest.json" />

          {/* Google fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Roboto:wght@400;500&display=swap"
            rel="stylesheet"
          />

          {/* Facebook */}
          <meta
            property="og:url"
            content="https://letmeask-virid.vercel.app/"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Letmeask" />
          <meta
            property="og:description"
            content="Crie sala de perguntas e respostas ao vivo"
          />
          <meta
            property="og:image"
            content="https://letmeask-virid.vercel.app/letmeask.jpg"
          />

          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5" // ,user-scalable=no
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
