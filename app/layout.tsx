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
          <Navbar />
          <div className="pt-20"> {/* Navbar yüksekliği için padding güncellendi */}
            {children}
          </div>
          <PerformanceMetrics />
        </Providers>
      </body>
    </html>
  )
}