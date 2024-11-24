'use client'

import { useQuery } from '@tanstack/react-query'
import { formatRelativeTime, getSecondsDifference } from '../../utils/time'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, HourglassHigh } from '@phosphor-icons/react'

export default function PoolOverviewCard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  const { data: apiData } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/metrics')
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    }
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/stats')
      return res.json()
    },
    refetchInterval: 10000
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTimeAgo = (timestamp: string) => {
    const seconds = getSecondsDifference(timestamp, currentTime)
    return formatRelativeTime(seconds)
  }

  return (
    <div className="pixel-card py-2 px-2">
      <div className="flex gap-2 items-center">
        <div className="flex-shrink-0 bg-pixel-bg/80 p-3 rounded-md">
          <p className="text-pixel-secondary mb-2">Active Pools</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/charisma.png"
                alt="Charisma logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-sm text-pixel-primary">{apiData?.pools?.bySource?.charisma || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/velar.png"
                alt="Velar logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-sm text-pixel-primary">{apiData?.pools?.bySource?.velar || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 bg-pixel-bg/80 p-3 rounded-md">
          <p className="text-pixel-secondary mb-2">Last Update</p>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-pixel-primary" weight="bold" />
            <p className="text-sm text-pixel-primary">{stats?.lastUpdate ? getTimeAgo(stats.lastUpdate) : '...'}</p>
          </div>
        </div>

        <div className="flex-shrink-0 bg-pixel-bg/80 p-3 rounded-md">
          <p className="text-pixel-secondary mb-2">Last Swap</p>
          <div className="flex items-center gap-2">
            <HourglassHigh className="w-6 h-6 text-pixel-primary" weight="bold" />
            <p className="text-sm text-pixel-primary">{stats?.lastSwap ? getTimeAgo(stats.lastSwap) : '...'}</p>
          </div>
        </div>

        <div className="ml-auto flex-shrink-0 flex justify-center items-center w-12">
          <div className={`w-3 h-3 rounded-full ${stats ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
        </div>
      </div>
    </div>
  )
}