import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>LOCUS</title>
        <meta name="description" content="Social network for mobile professionals" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000000'/%3E%3Cg stroke='%23ffffff' stroke-width='1' fill='none'%3E%3Crect x='10' y='10' width='80' height='80'/%3E%3Cpath d='M10,10 L50,50 L90,10 M10,90 L50,50 L90,90 M10,10 L50,30 L90,50 M10,50 L50,70 L90,90'/%3E%3C/g%3E%3C/svg%3E" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000000'/%3E%3Cg stroke='%23ffffff' stroke-width='1' fill='none'%3E%3Crect x='10' y='10' width='80' height='80'/%3E%3Cpath d='M10,10 L50,50 L90,10 M10,90 L50,50 L90,90 M10,10 L50,30 L90,50 M10,50 L50,70 L90,90'/%3E%3C/g%3E%3C/svg%3E" />
      </Head>
      <Component {...pageProps} />
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