export interface WalletAnalysis {
  address: string;
  ogStatus: {
    firstTransactionDate: string | null;
    daysSinceFirst: number | null;
  };
  lastSeen: {
    lastTransactionDate: string | null;
    daysSinceLast: number | null;
  };
  whaleStatus: {
    tier: string;
    solBalance: number;
  };
  topHoldings: Array<{
    symbol: string;
    name: string;
    amount: number;
    usdValue?: number;
  }>;
  topEcosystems: Array<{
    name: string;
    interactionCount: number;
  }>;
}
