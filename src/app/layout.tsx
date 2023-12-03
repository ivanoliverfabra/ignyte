import { Layout } from '@/components/layout/layout'
import "@fontsource/inter";
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ignyte',
  description: 'ignyte is a platform for finding matching profile pictures.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    userScalable: false
  },
  appleWebApp: {
    capable: true,
    title: 'ignyte',
    startupImage: '/logo.png',
    statusBarStyle: 'black-translucent'
  }
}

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <body className='dark' style={{ fontFamily: 'Inter' }}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}
