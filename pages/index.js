import Head from 'next/head'
import LandingPage from '../components/LandingPage'

export default function Home() {
  return (
    <>
      <Head>
        <title>LOCUS</title>
        <meta name="description" content="The point where ambitious paths converge." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="LOCUS" />
        <meta property="og:description" content="The point where ambitious paths converge." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://locus.club" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LOCUS" />
        <meta name="twitter:description" content="The point where ambitious paths converge." />
      </Head>
      <LandingPage />
    </>
  )
} 