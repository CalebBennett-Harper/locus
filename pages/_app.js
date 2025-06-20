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
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://locus.fyi/" />
        <meta property="og:title" content="LOCUS - Join the Waitlist" />
        <meta property="og:description" content="The point where ambitious paths converge. Curated social infrastructure for Gen Z professionals who move between cities." />
        <meta property="og:image" content="https://locus.fyi/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://locus.fyi/" />
        <meta property="twitter:title" content="LOCUS - Join the Waitlist" />
        <meta property="twitter:description" content="The point where ambitious paths converge. Curated social infrastructure for Gen Z professionals who move between cities." />
        <meta property="twitter:image" content="https://locus.fyi/og-image.png" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000000'/%3E%3Cg stroke='%23ffffff' stroke-width='1' fill='none'%3E%3Crect x='10' y='10' width='80' height='80'/%3E%3Cpath d='M10,10 L50,50 L90,10 M10,90 L50,50 L90,90 M10,10 L50,30 L90,50 M10,50 L50,70 L90,90'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="apple-touch-icon" sizes="180x180" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23000000'/%3E%3Cg stroke='%23ffffff' stroke-width='2' fill='none'%3E%3Crect x='20' y='20' width='140' height='140'/%3E%3Cpath d='M20,20 L90,90 L160,20 M20,160 L90,90 L160,160 M20,20 L90,50 L160,80 M20,80 L90,110 L160,160'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="icon" type="image/png" sizes="32x32" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23000000'/%3E%3Cg stroke='%23ffffff' stroke-width='0.5' fill='none'%3E%3Crect x='4' y='4' width='24' height='24'/%3E%3Cpath d='M4,4 L16,16 L28,4 M4,28 L16,16 L28,28 M4,4 L16,10 L28,16 M4,16 L16,22 L28,28'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="icon" type="image/png" sizes="16x16" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23000000'/%3E%3Cg stroke='%23ffffff' stroke-width='0.3' fill='none'%3E%3Crect x='2' y='2' width='12' height='12'/%3E%3Cpath d='M2,2 L8,8 L14,2 M2,14 L8,8 L14,14'/%3E%3C/g%3E%3C/svg%3E" />
        
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