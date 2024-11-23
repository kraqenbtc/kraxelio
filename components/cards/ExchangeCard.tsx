'use client'

import { ArrowUp } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { Exchange } from '../../types/exchanges'

export default function ExchangeCard() {
  const { data: apiData, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/metrics')
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    }
  })

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await fetch('https://api.kraxel.io/api/status')
      return res.json()
    }
  })

  const isLoading = metricsLoading || statusLoading

  const exchanges = apiData && statusData ? [
    {
      name: 'Charisma',
      status: statusData?.services?.pools?.CHARISMA ? 'active' : 'inactive',
      imageType: 'png',
      metrics: {
        tvl: 'x M',
        tvlChange: '+2.22',
        volume24h: `${apiData?.swaps?.bySource?.charisma || 0} swaps`,
        pools: apiData?.pools?.bySource?.charisma || 0
      }
    },
    {
      name: 'Velar',
      status: statusData?.services?.pools?.VELAR ? 'active' : 'inactive',
      imageType: 'svg',
      metrics: {
        tvl: 'x M',
        tvlChange: '+3.45',
        volume24h: `${apiData?.swaps?.bySource?.velar || 0} swaps`,
        pools: apiData?.pools?.bySource?.velar || 0
      }
    },
    {
      name: 'AlexLAB',
      status: 'inactive',
      imageType: 'png',
      maintenance: true,
      metrics: {
        tvl: '0',
        tvlChange: '0',
        volume24h: '0 swaps',
        pools: 0
      }
    }
  ] : []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="pixel-card flex flex-col animate-pulse">
            <div className="h-14 px-4">
              <div className="h-full bg-pixel-primary/10 rounded" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="h-16 bg-pixel-primary/10 rounded" />
              <div className="h-16 bg-pixel-primary/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exchanges.map((exchange) => (
        <div key={exchange.name} className="pixel-card flex flex-col relative">
          {'maintenance' in exchange && (
            <div className="absolute inset-0 bg-pixel-bg/80 flex items-center justify-center z-10">
              <span className="text-pixel-error font-bold text-lg">MAINTENANCE</span>
            </div>
          )}
          <div className="h-12 flex items-center gap-3 px-4 pixel-border-b">
            <Image
              src={`/${exchange.name.toLowerCase()}.${exchange.imageType}`}
              alt={`${exchange.name} logo`}
              width={24}
              height={24}
              className="rounded-sm"
            />
            <h2 className="pixel-heading mb-0">{exchange.name}</h2>
            <div className={`w-3 h-3 rounded-full ml-auto ${
              exchange.status === 'active' ? 'bg-pixel-success' : 'bg-pixel-error'
            }`} />
          </div>

          <div className="flex-1 p-4 space-y-4">
            <div>
              <p className="text-pixel-secondary">Total Value Locked</p>
              <div className="flex items-baseline gap-2">
                <p className="pixel-stat">{exchange.metrics.tvl}</p>
                <div className="flex items-center text-pixel-success">
                  <ArrowUp weight="bold" />
                  <span>{exchange.metrics.tvlChange}%</span>
                </div>
              </div>
            </div>

            <div className="pixel-divider">
              <p className="text-pixel-secondary">24h Volume</p>
              <p className="pixel-stat">{exchange.metrics.volume24h}</p>
            </div>

            <div className="pixel-divider">
              <p className="text-pixel-secondary">Active Pools</p>
              <p className="pixel-stat">{exchange.metrics.pools}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}