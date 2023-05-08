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
        <button>
          <Link href='/LoginPage'> Login In</Link>
        </button>
        <button>
          <Link href='/SignupPage'>Sign up</Link>
        </button>
        <p>
          (This is a sample website - we will be building something like this for you.{' '})
        </p>
      </section>
    </Layout>
    )
}
