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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayCount, setDisplayCount] = useState(3);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: allSwapLogs = [] } = useQuery({
    queryKey: ['swap-logs'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/swap-logs')
      const data = await res.json()
      return data as SwapLog[]
    },
    refetchInterval: 5000
  });

  useEffect(() => {
    setDisplayCount(isFullscreen ? 8 : 3);
  }, [isFullscreen]);

  const displayedSwaps = allSwapLogs.slice(0, displayCount);

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    setIsFullscreen(!isFullscreen);
  };

  const getTimeAgo = (timestamp: string) => {
    const currentTime = new Date();
    const seconds = getSecondsDifference(timestamp, currentTime);
    return formatRelativeTime(seconds);
  };

  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  return (
    <>
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-pixel-bg/80 backdrop-blur-sm z-40" 
          onClick={handleFullscreenToggle}
        />
      )}
      <div 
        ref={containerRef} 
        className={`pixel-border bg-pixel-bg p-4 ${
          isFullscreen ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl z-50' : ''
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
            </div>
          </div>

          {/* Swap listesi */}
          {allSwapLogs.length > 0 ? (
            <div className="space-y-3">
              {displayedSwaps.map((swap, index) => (
                <div key={`${swap.timestamp}-${index}`} className="flex justify-between pixel-divider">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/${swap.source}.${getExchangeImage(swap.source)?.type}`}
                      alt={getExchangeImage(swap.source)?.alt || ''}
                      width={28}
                      height={28}
                      className={`rounded-sm ${
                        getExchangeImage(swap.source)?.type === 'svg'
                          ? 'w-7 h-auto'
                          : 'w-7 h-7'
                      }`}
                    />
                    <div className="w-[1px] h-7 bg-pixel-primary/10"></div>
                    <Image 
                      src={`/${getSwapDetails(swap).type}.gif`}
                      alt={getSwapDetails(swap).type}
                      width={28}
                      height={28}
                      className="rounded-full w-7 h-7"
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
              {[...Array(displayCount)].map((_, i) => (
                <div key={i} className="h-16 bg-pixel-primary/10 rounded" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}