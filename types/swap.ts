import { Exchange } from './exchanges';

export interface SwapLog {
  timestamp: string;
  source: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
}

export interface ExchangeImage {
  src: string;
  alt: string;
  type: 'svg' | 'png';
} 