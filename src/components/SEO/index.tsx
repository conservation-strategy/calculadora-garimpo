import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  image?: string
}

export default function SEO({
  title = 'Calculadora',
  description = 'A Calculadora de Impactos do Garimpo é uma ferramenta de valoração dos danos sociais e ambientais causados pela mineração ilegal de ouro',
  image = 'logo-fundo1.png',
}: SEOProps) {
  const headTitle = `${title} | CSF`;
  return (
    <Head>
      <title>{headTitle}</title>
      <meta name="description" content={description} key="description" />

      {/* Open Graph Tags (for social sharing) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${process.env.NEXT_PUBLIC_PRODUCTION_URL}assets/images/${image}`} />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_PRODUCTION_URL} />
      <meta property="og:type" content="website" />
    </Head>
  )
}
