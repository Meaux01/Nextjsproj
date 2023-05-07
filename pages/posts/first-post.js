import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import Layout from "../../components/layouts";

export default function FirstPost(){
    return (
    <Layout>
    <Head>
    <title>First Post</title>
    <Script src="https://connect.facebook.net/en_US/sdk.js"
    strategy="lazyOnload"
    onLoad={() =>
      console.log(`script loaded correctly, window.FB has been populated`)
    }
    />
    </Head>
    <h1>First Post</h1>

    <h2><Link href='/'>Home Page</Link></h2>
    
    </Layout>
    );
}