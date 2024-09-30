import Layout from '@/components/Layout'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import Link from 'next/link'

export default function Contact() {
  const { state } = useAppContext()
  const { language } = state
  const { contact } = language
  return (
    <Layout headline={contact.headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={contact.headline} /> */}
      <SEO {...seoMetadata.contact} />
      <SG.Container>
        <SG.Headline>{contact.tagline}</SG.Headline>
        {contact.contacts.map((contactItem) => (
          <div key={contactItem.tagline}>
            <SG.Text>{contactItem.tagline}</SG.Text>
            {contactItem.mails.map((mail) => (
              <SG.Text key={mail}>
                <Link href={`mailto:${mail}`}>{mail}</Link>
              </SG.Text>
            ))}
            <br />
          </div>
        ))}
      </SG.Container>
    </Layout>
  )
}
