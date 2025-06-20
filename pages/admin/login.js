import Head from 'next/head'
import AdminLoginPage from '../../components/AdminLoginPage'

export default function AdminLogin() {
  return (
    <>
      <Head>
        <title>Admin Login - Locus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLoginPage />
    </>
  )
} 