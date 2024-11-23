export interface Exchange {
  name: string;
  status: 'active' | 'inactive';
  imageType: 'svg' | 'gif' | 'png';
  maintenance?: boolean;
  metrics: {
    tvl: string;
    tvlChange: string;
    volume24h: string;
    pools: number;
  };
} 