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
    velar: { type: 'png', alt: 'Velar logo' }
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
  const [displayCount, setDisplayCount] = useState(6);
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

  const { data: statusData } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/status')
      return res.json()
    }
  })

  // Sistem durumunu kontrol et
  const isSystemActive = statusData?.services?.pools?.CHARISMA || statusData?.services?.pools?.VELAR

  useEffect(() => {
    setDisplayCount(isFullscreen ? 8 : 6);
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

  // Swapları iki gruba ayıran yardımcı fonksiyon
  const splitSwaps = (swaps: SwapLog[]) => {
    const leftSwaps = swaps.slice(0, 3);
    const rightSwaps = swaps.slice(3, 6);
    return { leftSwaps, rightSwaps };
  };

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 bg-pixel-bg/80 backdrop-blur-sm z-40 overflow-auto" onClick={handleFullscreenToggle} />
      )}
      <div ref={containerRef} className="pixel-card flex flex-col h-full">
        <div className="h-12 flex items-center gap-3 px-4 pixel-border-b">
          <h2 className="pixel-heading mb-0">Latest Swaps</h2>
          <div className="flex items-center gap-4 ml-auto">
            <SwapControls 
              onFullscreenToggle={handleFullscreenToggle}
              isFullscreen={isFullscreen}
              onSoundToggle={handleSoundToggle}
              isSoundEnabled={isSoundEnabled}
            />
            <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
          </div>
        </div>

        {allSwapLogs.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 p-4 relative">
            <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-pixel-primary/10" />
            <div className="space-y-2">
              {splitSwaps(displayedSwaps).leftSwaps.map((swap, index) => (
                <div 
                  key={`${swap.timestamp}-${index}`} 
                  className="flex justify-between items-center py-2 border-t first:border-t-0 border-pixel-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/${swap.source}.${getExchangeImage(swap.source)?.type}`}
                      alt={getExchangeImage(swap.source)?.alt || ''}
                      width={28}
                      height={28}
                      className="rounded-sm w-7 h-7 bg-pixel-bg"
                    />
                    <div className="w-[1px] h-7 bg-pixel-primary/10"></div>
                    <Image 
                      src={`/${getSwapDetails(swap).type}.gif`}
                      alt={getSwapDetails(swap).type}
                      width={28}
                      height={28}
                      className="rounded-full w-7 h-7"
                      unoptimized
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

            <div className="space-y-2">
              {splitSwaps(displayedSwaps).rightSwaps.map((swap, index) => (
                <div 
                  key={`${swap.timestamp}-${index}`} 
                  className="flex justify-between items-center py-2 border-t first:border-t-0 border-pixel-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/${swap.source}.${getExchangeImage(swap.source)?.type}`}
                      alt={getExchangeImage(swap.source)?.alt || ''}
                      width={28}
                      height={28}
                      className="rounded-sm w-7 h-7 bg-pixel-bg"
                    />
                    <div className="w-[1px] h-7 bg-pixel-primary/10"></div>
                    <Image 
                      src={`/${getSwapDetails(swap).type}.gif`}
                      alt={getSwapDetails(swap).type}
                      width={28}
                      height={28}
                      className="rounded-full w-7 h-7"
                      unoptimized
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
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={`left-${i}`} className="h-16 bg-pixel-primary/10 rounded animate-pulse" />
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={`right-${i}`} className="h-16 bg-pixel-primary/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}