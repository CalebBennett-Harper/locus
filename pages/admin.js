import Head from 'next/head'
import AdminDashboard from '../components/AdminDashboard'

export default function Admin() {
  return (
    <>
      <Head>
        <title>Admin Dashboard - Locus</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdminDashboard />
    </>
  )
} 