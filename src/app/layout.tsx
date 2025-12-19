import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css'
import '@/styles/admin.css'
import '@/styles/theme.css'
import RealtimeBanner from '@/components/RealtimeBanner'
import Navbar from '@/components/Navbar'
import KOMU_CONFIG from '@/config/komu.config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${KOMU_CONFIG.appName} — Academic Organizer`,
  description: KOMU_CONFIG.description,
  keywords: 'KOMU, assignments, results, group-work, education, academic organizer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RealtimeBanner />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
