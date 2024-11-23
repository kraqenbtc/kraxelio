import ExchangeCard from '@/components/cards/ExchangeCard'
import PoolOverviewCard from '@/components/cards/PoolOverviewCard'
import DetailedPoolCard from '@/components/cards/DetailedPoolCard'

export default function Home() {
  return (
    <div className="bg-pixel-bg h-[calc(100vh-5rem)]">
      <div className="scrollable-content">
        <div className="p-2">
          <div className="max-w-[1024px] mx-auto">
            <div className="space-y-3">
              <ExchangeCard />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PoolOverviewCard />
                <DetailedPoolCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}