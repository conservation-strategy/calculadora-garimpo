import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
}

export default function SEO({
  title = 'Calculadora',
  description = 'A Calculadora de Impactos do Garimpo é uma ferramenta de valoração dos danos sociais e ambientais causados pela mineração ilegal de ouro'
}: SEOProps) {
  return (
    <Head>
      <title>{title} | CSF</title>
      <meta name="description" content={description} key="description" />
    </Head>
  )
}
