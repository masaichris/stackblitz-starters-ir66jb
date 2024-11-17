import { Metadata } from 'next'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mobile Money Management',
  description: 'Mobile Money Management System',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <AuthProvider>
            <Navigation />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}