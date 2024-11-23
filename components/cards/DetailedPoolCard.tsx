'use client'

import { useQuery } from '@tanstack/react-query'
import { formatRelativeTime, getSecondsDifference } from '../../utils/time'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { SwapControls } from '../controls/SwapControls'

interface SwapLog {
  timestamp: string
  poolId: number
  symbol: string
  token0: string
  token1: string
  source: string
  reserve0: {
    from: string
    to: string
  }
  reserve1: {
    from: string
    to: string
  }
}

const formatSymbol = (symbol: string) => {
  const [token1, token2] = symbol.split('-')
  return `${token1} / ${token2}`
}

const getExchangeImage = (source: string) => {
  const imageMap = {
    charisma: { type: 'png', alt: 'Charisma logo' },
    velar: { type: 'svg', alt: 'Velar logo' }
  }
  return imageMap[source as keyof typeof imageMap]
}

const getSwapDetails = (swapLog: SwapLog) => {
  const token0Delta = Math.abs(Number(swapLog.reserve0.to) - Number(swapLog.reserve0.from)) / 1_000_000
  const token1Delta = Math.abs(Number(swapLog.reserve1.to) - Number(swapLog.reserve1.from)) / 1_000_000
  const isSellToken1 = Number(swapLog.reserve0.from) > Number(swapLog.reserve0.to)
  const tokenSymbol = swapLog.symbol.split('-')[1]

  if (isSellToken1) {
    return {
      type: 'sell',
      message: `${tokenSymbol} → ${token0Delta.toFixed(2)} STX`
    }
  } else {
    return {
      type: 'buy',
      message: `${token0Delta.toFixed(2)} STX → ${tokenSymbol}`
    }
  }
}

export default function DetailedPoolCard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [isOnline, setIsOnline] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const upSound = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/up.mp3') : null)
  const downSound = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/down.mp3') : null)

  const { data: swapLogs, dataUpdatedAt } = useQuery({
    queryKey: ['swap-logs'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/swap-logs')
      const data = await res.json()
      return data.slice(0, isFullscreen ? 10 : 3) as SwapLog[]
    },
    refetchInterval: 5000
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (dataUpdatedAt) {
      const timeSinceLastUpdate = Date.now() - dataUpdatedAt
      setIsOnline(timeSinceLastUpdate < 10000)
    }
  }, [dataUpdatedAt, currentTime])

  const getTimeAgo = (timestamp: string) => {
    const seconds = getSecondsDifference(timestamp, currentTime)
    return formatRelativeTime(seconds)
  }

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled)
  }

  useEffect(() => {
    if (isSoundEnabled && swapLogs && swapLogs.length > 0) {
      const latestSwap = swapLogs[0]
      const swapType = getSwapDetails(latestSwap).type
      
      if (swapType === 'buy') {
        upSound.current?.play()
      } else {
        downSound.current?.play()
      }
    }
  }, [swapLogs, isSoundEnabled])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFullscreen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleFullscreenToggle()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFullscreen])

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 bg-pixel-bg/80 backdrop-blur-sm z-40" />
      )}
      <div 
        ref={containerRef} 
        className={`pixel-border bg-pixel-bg p-4 ${
          isFullscreen ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[80vh] overflow-auto z-50' : ''
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="h-12 flex items-center gap-3 px-4 pixel-border-b">
            <h2 className="pixel-heading mb-0">Latest Swaps</h2>
            <div className="flex items-center gap-4 ml-auto">
              <SwapControls 
                onFullscreenToggle={handleFullscreenToggle}
                isFullscreen={isFullscreen}
                onSoundToggle={handleSoundToggle}
                isSoundEnabled={isSoundEnabled}
              />
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
            </div>
          </div>

          {/* Swap listesi */}
          {swapLogs ? (
            <div className="space-y-3">
              {swapLogs.map((swap, index) => (
                <div key={`${swap.timestamp}-${index}`} className="flex justify-between pixel-divider">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/${swap.source}.${getExchangeImage(swap.source)?.type}`}
                      alt={getExchangeImage(swap.source)?.alt || ''}
                      width={28}
                      height={28}
                      className="rounded-sm pixelated"
                    />
                    <Image 
                      src={`/${getSwapDetails(swap).type}.gif`}
                      alt={getSwapDetails(swap).type}
                      width={28}
                      height={28}
                      className="rounded-full pixelated"
                    />
                  </div>
                  <div className="text-right">
                    <div className={getSwapDetails(swap).type === 'buy' ? 'text-pixel-success' : 'text-pixel-error'}>
                      {getSwapDetails(swap).message}
                    </div>
                    <div className="text-pixel-secondary text-sm">
                      {getTimeAgo(swap.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-pixel-primary/10 rounded" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}