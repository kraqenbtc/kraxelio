'use client'

import { Wallet } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-pixel-bg z-50">
      <div className="pixel-container">
        <div className="flex items-center justify-between h-20 border-b border-pixel-primary/20">
          <Link href="/" className="flex items-center gap-4 group">
            <Image
              src="/kraken.png"
              alt="Kraken Logo"
              width={64}
              height={64}
              className="transition-transform group-hover:scale-110"
            />
            <span className="pixel-heading">KRAXEL</span>
          </Link>
          
          <button className="pixel-button flex items-center gap-2">
            <Wallet size={18} />
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  )
}