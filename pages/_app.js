import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>LOCUS</title>
        <meta name="description" content="The point where ambitious paths converge. Curated social infrastructure for Gen Z professionals who move between cities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Basic meta for link previews */}
        <meta name="image" content="/og-image.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://locus.fyi/" />
        <meta property="og:title" content="LOCUS - Join the Waitlist" />
        <meta property="og:description" content="The point where ambitious paths converge. Curated social infrastructure for Gen Z professionals who move between cities." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LOCUS - Mathematical convergence design" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://locus.fyi/" />
        <meta property="twitter:title" content="LOCUS - Join the Waitlist" />
        <meta property="twitter:description" content="The point where ambitious paths converge. Curated social infrastructure for Gen Z professionals who move between cities." />
        <meta property="twitter:image" content="/og-image.png" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/og-image.png" sizes="180x180" />
        
        {/* iOS Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="LOCUS" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #475569',
          },
          success: {
            iconTheme: {
              primary: '#f2750a',
              secondary: '#f8fafc',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc',
            },
          },
        }}
      />
    </>
  )
} 