import { GlobalStyle } from '@/styles/global'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { AppContextProvider } from '@/store/proveider'
import useAppContext from '@/hooks/useAppContext'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Analytics } from '@vercel/analytics/react'
import { hotjar } from 'react-hotjar'
import { useEffect } from 'react'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  const { state } = useAppContext()
  const { language } = state

  useEffect(() => {
    hotjar.initialize(3421391, 6)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyle />
      <AppContextProvider>
        <Script type="text/javascript" id="lgpd">
          {`(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);`}
        </Script>
        <GoogleAnalytics trackPageViews />
        <Component {...pageProps} />
        <Analytics />
      </AppContextProvider>
    </>
  )
}
