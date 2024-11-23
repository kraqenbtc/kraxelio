import ExchangeCard from '@/components/cards/ExchangeCard'
import PoolOverviewCard from '@/components/cards/PoolOverviewCard'
import DetailedPoolCard from '@/components/cards/DetailedPoolCard'

export default function Home() {
  return (
    <main className="h-full bg-pixel-bg">
      <div className="scrollable-content p-4 sm:p-8">
        <div className="max-w-[1024px] mx-auto">
          <div className="pixel-border bg-pixel-bg p-4 mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl text-pixel-primary">Explore</h1>
              <p className="text-pixel-secondary">Pixel by Pixel</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <ExchangeCard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PoolOverviewCard />
              <DetailedPoolCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}