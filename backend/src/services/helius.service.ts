import axios from 'axios';
import { ECOSYSTEMS, getWhaleTier } from '../config/ecosystems';

const HELIUS_BASE_URL = 'https://api.helius.xyz/v0';
const LAMPORTS_PER_SOL = 1_000_000_000;

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

export class HeliusService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get comprehensive wallet analysis
   */
  async analyzeWallet(address: string): Promise<WalletAnalysis> {
    const [balance, transactions, assets] = await Promise.all([
      this.getBalance(address),
      this.getTransactions(address),
      this.getAssets(address),
    ]);

    const ogStatus = this.calculateOGStatus(transactions);
    const lastSeen = this.calculateLastSeen(transactions);
    const whaleStatus = {
      tier: getWhaleTier(balance),
      solBalance: balance,
    };
    const topHoldings = this.getTopHoldings(assets, balance);
    const topEcosystems = this.analyzeEcosystems(transactions);

    return {
      address,
      ogStatus,
      lastSeen,
      whaleStatus,
      topHoldings,
      topEcosystems,
    };
  }

  /**
   * Get SOL balance for an address
   */
  private async getBalance(address: string): Promise<number> {
    try {
      const response = await axios.post(
        `${HELIUS_BASE_URL}/addresses/${address}/balances?api-key=${this.apiKey}`
      );

      const nativeBalance = response.data.nativeBalance || 0;
      return nativeBalance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  /**
   * Get transaction history (limited to last 30 days for ecosystem analysis)
   */
  private async getTransactions(address: string): Promise<any[]> {
    try {
      // Get parsed transaction history
      const response = await axios.get(
        `${HELIUS_BASE_URL}/addresses/${address}/transactions?api-key=${this.apiKey}&limit=1000`
      );

      return response.data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  /**
   * Get token assets for an address
   */
  private async getAssets(address: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${HELIUS_BASE_URL}/addresses/${address}/balances?api-key=${this.apiKey}`
      );

      return response.data.tokens || [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  }

  /**
   * Calculate OG status from transactions
   */
  private calculateOGStatus(transactions: any[]): {
    firstTransactionDate: string | null;
    daysSinceFirst: number | null;
  } {
    if (!transactions || transactions.length === 0) {
      return { firstTransactionDate: null, daysSinceFirst: null };
    }

    // Transactions are usually ordered newest first, so get the last one
    const firstTx = transactions[transactions.length - 1];
    const firstDate = new Date(firstTx.timestamp * 1000);
    const now = new Date();
    const daysSinceFirst = Math.floor(
      (now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      firstTransactionDate: firstDate.toISOString(),
      daysSinceFirst,
    };
  }

  /**
   * Calculate last seen from transactions
   */
  private calculateLastSeen(transactions: any[]): {
    lastTransactionDate: string | null;
    daysSinceLast: number | null;
  } {
    if (!transactions || transactions.length === 0) {
      return { lastTransactionDate: null, daysSinceLast: null };
    }

    // First transaction in the array is the most recent
    const lastTx = transactions[0];
    const lastDate = new Date(lastTx.timestamp * 1000);
    const now = new Date();
    const daysSinceLast = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      lastTransactionDate: lastDate.toISOString(),
      daysSinceLast,
    };
  }

  /**
   * Get top token holdings
   */
  private getTopHoldings(
    assets: any[],
    solBalance: number
  ): Array<{
    symbol: string;
    name: string;
    amount: number;
    usdValue?: number;
  }> {
    const holdings = [
      {
        symbol: 'SOL',
        name: 'Solana',
        amount: solBalance,
        usdValue: 0, // Could integrate price API here
      },
    ];

    // Add token holdings
    if (assets && assets.length > 0) {
      const tokenHoldings = assets
        .filter((token) => token.amount > 0)
        .map((token) => ({
          symbol: token.tokenAccount?.tokenSymbol || 'Unknown',
          name: token.tokenAccount?.tokenName || 'Unknown Token',
          amount: token.amount / Math.pow(10, token.decimals || 9),
          usdValue: 0, // Could integrate price API here
        }))
        .sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0))
        .slice(0, 5);

      holdings.push(...tokenHoldings);
    }

    return holdings.slice(0, 6); // Return top 6 holdings
  }

  /**
   * Analyze ecosystem interactions from transactions
   */
  private analyzeEcosystems(transactions: any[]): Array<{
    name: string;
    interactionCount: number;
  }> {
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;

    // Filter transactions from last 30 days
    const recentTransactions = transactions.filter(
      (tx) => tx.timestamp >= thirtyDaysAgo
    );

    // Count interactions with each ecosystem
    const ecosystemCounts: Record<string, number> = {};

    for (const tx of recentTransactions) {
      // Check all account keys in the transaction
      const accountKeys = tx.accountData || [];

      for (const [ecosystemKey, ecosystem] of Object.entries(ECOSYSTEMS)) {
        for (const programId of ecosystem.programIds) {
          if (accountKeys.some((key: any) => key.account === programId)) {
            ecosystemCounts[ecosystem.name] =
              (ecosystemCounts[ecosystem.name] || 0) + 1;
          }
        }
      }

      // Also check instructions
      if (tx.instructions) {
        for (const instruction of tx.instructions) {
          for (const [ecosystemKey, ecosystem] of Object.entries(ECOSYSTEMS)) {
            if (ecosystem.programIds.includes(instruction.programId)) {
              ecosystemCounts[ecosystem.name] =
                (ecosystemCounts[ecosystem.name] || 0) + 1;
            }
          }
        }
      }
    }

    // Convert to array and sort by count
    const ecosystemArray = Object.entries(ecosystemCounts)
      .map(([name, count]) => ({
        name,
        interactionCount: count,
      }))
      .sort((a, b) => b.interactionCount - a.interactionCount);

    // Return top 2 ecosystems
    return ecosystemArray.slice(0, 2);
  }
}
