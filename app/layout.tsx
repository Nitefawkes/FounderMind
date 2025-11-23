import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/ui/Navigation'

export const metadata: Metadata = {
  title: 'FounderMind - AI-Powered Startup Simulation',
  description: 'Run virtual startups with AI-powered board members and advisors. Learn entrepreneurship without risking real capital.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
