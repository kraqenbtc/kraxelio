'use client'

import { useQuery } from '@tanstack/react-query'
import { formatRelativeTime, getSecondsDifference } from '../../utils/time'
import Image from 'next/image'
import { useEffect, useState } from 'react'

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

  const { data: swapLogs, dataUpdatedAt } = useQuery({
    queryKey: ['swap-logs'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/swap-logs')
      const data = await res.json()
      return data.slice(0, 3) as SwapLog[]
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

  return (
    <div className="pixel-border bg-pixel-bg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="pixel-heading">Latest Swaps</h2>
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
      </div>
      
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
                  className="rounded-sm"
                />
                <span className={`text-lg font-bold ${getSwapDetails(swap).type === 'buy' ? 'text-pixel-success' : 'text-pixel-error'}`}>
                  {getSwapDetails(swap).type.toUpperCase()}
                </span>
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
  )
}