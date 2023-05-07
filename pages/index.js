import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout, {siteTitle} from '../components/layouts';
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    
      <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1>Welcome To Meaux LLC</h1>
        <p>
          (This is a sample website - we will be building something like this for you.{' '})
        </p>
      </section>
    </Layout>
    )
}
