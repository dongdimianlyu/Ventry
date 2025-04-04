import './globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import AuthInitializer from '@/components/AuthInitializer'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const robotoMono = Roboto_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ventry - Strategic Planning for Small Businesses',
  description: 'AI-powered strategic planning platform helping small businesses achieve ambitious goals with actionable daily steps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased h-full`}
        suppressHydrationWarning
      >
        <AuthInitializer />
        <ClientLayout>
          <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
            {children}
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}
