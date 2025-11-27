import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css'
import '@/styles/admin.css'
import '@/styles/theme.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudyHub - Assignment & Group Work Manager',
  description: 'A comprehensive platform for students and lecturers to manage assignments, group work, and study materials',
  keywords: 'assignment, education, study, group-work, management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
