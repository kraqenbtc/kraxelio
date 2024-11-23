import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '../components/layout/Navbar'
import PerformanceMetrics from '../components/metrics/PerformanceMetrics'

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'] 
})

export const metadata = {
  title: 'Kraxel - Explore Pixel by Pixel',
  description: 'STX Pixel Screen Analytics',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        url: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 mt-20">
              {children}
            </main>
            <PerformanceMetrics />
          </div>
        </Providers>
      </body>
    </html>
  )
}