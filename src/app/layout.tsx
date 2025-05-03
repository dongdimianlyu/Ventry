import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'

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
      <body className="antialiased font-sans h-full" suppressHydrationWarning>
        <ClientLayout>
          <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
            <div className="flex-grow">
              {children}
            </div>
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}
