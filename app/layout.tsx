import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Real-Time Chat App',
  description: 'Real-time chat application with Supabase',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
