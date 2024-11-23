import ExchangeCard from '@/components/cards/ExchangeCard'
import PoolOverviewCard from '@/components/cards/PoolOverviewCard'
import DetailedPoolCard from '@/components/cards/DetailedPoolCard'

export default function Home() {
  return (
    <main className="min-h-screen bg-pixel-bg">
      <div className="scrollable-content">
        <div className="p-4 sm:p-8">
          <div className="max-w-[1024px] mx-auto">
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl text-pixel-primary">Explore</h1>
                <p className="text-sm text-pixel-secondary">Pixel by Pixel</p>
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
      </div>
    </main>
  )
}