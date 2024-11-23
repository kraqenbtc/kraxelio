'use client'

import { useQuery } from '@tanstack/react-query'
import { formatRelativeTime, getSecondsDifference } from '../../utils/time'
import { useEffect, useState } from 'react'

export default function PoolOverviewCard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

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
    <div className="pixel-border bg-pixel-bg p-4">
      <div className="h-12 flex items-center gap-3 px-4 pixel-border-b">
        <h2 className="pixel-heading mb-0">Pool Overview</h2>
        <div className={`w-3 h-3 rounded-full ml-auto ${stats ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-pixel-secondary">Active Pools</p>
          <p className="pixel-stat">{stats?.totalPools || '...'}</p>
        </div>

        <div className="pixel-divider">
          <p className="text-pixel-secondary">Last Swap</p>
          <p className="pixel-stat">{stats?.lastSwap ? getTimeAgo(stats.lastSwap) : '...'}</p>
        </div>

        <div className="pixel-divider">
          <p className="text-pixel-secondary">Last Pool Update</p>
          <p className="pixel-stat">{stats?.lastUpdate ? getTimeAgo(stats.lastUpdate) : '...'}</p>
        </div>
      </div>
    </div>
  )
}