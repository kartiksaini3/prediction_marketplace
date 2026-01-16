export interface Market {
  id: bigint;
  question: string;
  description: string;
  endTime: bigint;
  totalYesStake: bigint;
  totalNoStake: bigint;
  resolved: boolean;
  outcome: boolean;
  creator: string;
  createdAt: bigint;
  category: string;
}

export interface Prediction {
  marketId: bigint;
  predictor: string;
  prediction: boolean;
  amount: bigint;
  claimed: boolean;
}

export interface MarketCardProps {
  market: Market;
  onSelect?: (id: number) => void;
}

export interface CreateMarketFormData {
  question: string;
  description: string;
  duration: number;
  category: string;
}

export type MarketCategory =
  | "Sports"
  | "Politics"
  | "Crypto"
  | "Entertainment"
  | "Technology"
  | "Other";
