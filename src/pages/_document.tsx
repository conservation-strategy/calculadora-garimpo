import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { doppioOne, gudea } from '@/fonts/fonts';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <meta name="Author" content="Linze User Experience" key="author" />

          <link
            href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
          <link
            href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css"
            rel="stylesheet"
            crossOrigin="anonymous"
          />

          <link rel="icon" href="/assets/icons/favicon.webp" />
          <meta name="theme-color" content="#417505" />
          <meta name="application-name" content="Impact Calculator" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Impact Calculator" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body className={`${gudea.className}`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
