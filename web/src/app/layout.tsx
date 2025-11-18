import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Nexus - The AI-Native Code Editor That Doesn\'t Suck',
  description: 'Code faster with AI superpowers, Discord integration, and GPU acceleration. Stop context switching. Start coding in flow.',
  keywords: 'code editor, AI coding, Discord integration, GPU accelerated, developer tools, Zed alternative, VSCode alternative',
  authors: [{ name: 'Nexus Team' }],
  openGraph: {
    title: 'Nexus - The AI-Native Code Editor That Doesn\'t Suck',
    description: 'Blazing fast code editor with AI, Discord, and GPU acceleration built-in.',
    type: 'website',
    url: 'https://nexus-ide.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus - AI-Native Code Editor',
    description: 'Code faster with AI superpowers and Discord integration',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
