'use client'

import { useState, useEffect } from 'react'
import { ChartLineUp } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { formatRelativeTime, getSecondsDifference } from '../../utils/time'

interface StatusResponse {
  uptime: number
  timestamp: string
  services: {
    pools: {
      CHARISMA: boolean
      VELAR: boolean
    }
  }
}

interface StatsResponse {
  lastSwap: string
  lastUpdate: string
}

export default function PerformanceMetrics() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

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

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/metrics')
      return res.json()
    }
  })

  const { data: status } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/status')
      return res.json() as Promise<StatusResponse>
    }
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/stats')
      return res.json() as Promise<StatsResponse>
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  })

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-button flex items-center gap-2 bg-pixel-accent text-pixel-bg"
      >
        <ChartLineUp size={20} weight="bold" />
        Metrics
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 pixel-border bg-pixel-primary p-4">
          <h3 className="text-sm font-bold mb-3 text-pixel-bg">Performance Metrics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-pixel-secondary">API Response Time</span>
              <span className="text-pixel-bg">{metrics?.responseTime || metrics?.responseTime === 0 ? `${metrics.responseTime} ms` : '...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-secondary">Total Swaps (24h)</span>
              <span className="text-pixel-bg">{metrics?.swaps?.total || '...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-secondary">Total Pools</span>
              <span className="text-pixel-bg">{metrics?.pools?.total || '...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-secondary">Last Swap</span>
              <span className="text-pixel-bg">{stats?.lastSwap ? getTimeAgo(stats.lastSwap) : '...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-secondary">Last Update</span>
              <span className="text-pixel-bg">{stats?.lastUpdate ? getTimeAgo(stats.lastUpdate) : '...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-secondary">Uptime</span>
              <span className="text-pixel-bg">{status?.uptime ? formatUptime(status.uptime) : '...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pixel-secondary">Services Status</span>
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full ${status?.services.pools.CHARISMA ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
                <div className={`w-2 h-2 rounded-full ${status?.services.pools.VELAR ? 'bg-pixel-success' : 'bg-pixel-error'}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 