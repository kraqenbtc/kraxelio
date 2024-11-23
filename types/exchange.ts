import { Exchange } from '@/types/exchanges';

export function getExchangeImage(source: string, exchanges: Record<string, Exchange>) {
  const exchange = exchanges[source.toLowerCase()];
  
  if (exchange) {
    return {
      src: `/images/exchanges/${source.toLowerCase()}.${exchange.imageType}`,
      alt: `${exchange.name} Logo`,
      type: exchange.imageType
    };
  }

  // Fallback
  return {
    src: '/kraken.png',
    alt: 'Exchange Logo',
    type: 'png' as const
  };
} 