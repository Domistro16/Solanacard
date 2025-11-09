import axios from 'axios';
import { ECOSYSTEMS, getWhaleTier } from '../config/ecosystems';

const HELIUS_RPC_URL = 'https://mainnet.helius-rpc.com';
const HELIUS_API_URL = 'https://api.helius.xyz/v0';
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
  private rpcUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.rpcUrl = `${HELIUS_RPC_URL}/?api-key=${apiKey}`;
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
   * Get SOL balance for an address using Solana RPC
   */
  private async getBalance(address: string): Promise<number> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address],
      });

      const lamports = response.data.result?.value || 0;
      return lamports / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  /**
   * Get transaction history using Enhanced Transactions API
   */
  private async getTransactions(address: string): Promise<any[]> {
    try {
      // Get parsed transaction history from Enhanced Transactions API
      const response = await axios.get(
        `${HELIUS_API_URL}/addresses/${address}/transactions?api-key=${this.apiKey}`
      );

      return response.data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  /**
   * Get token assets for an address using DAS API
   */
  private async getAssets(address: string): Promise<any[]> {
    try {
      // Use DAS API getAssetsByOwner to get all tokens and NFTs
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 'get-assets',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: address,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: true,
            showNativeBalance: false,
          },
        },
      });

      return response.data.result?.items || [];
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
   * Get top token holdings from DAS API assets
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

    // Add token holdings from DAS API format
    if (assets && assets.length > 0) {
      const tokenHoldings = assets
        .filter((asset) => {
          // Filter for fungible tokens only
          return (
            asset.interface === 'FungibleToken' ||
            asset.interface === 'FungibleAsset'
          );
        })
        .map((asset) => {
          const content = asset.content;
          const tokenInfo = asset.token_info;

          return {
            symbol: tokenInfo?.symbol || content?.metadata?.symbol || 'Unknown',
            name: content?.metadata?.name || 'Unknown Token',
            amount: tokenInfo?.balance || 0,
            usdValue: tokenInfo?.price_info?.total_price || 0,
          };
        })
        .filter((token) => token.amount > 0)
        .sort((a, b) => (b.usdValue || b.amount) - (a.usdValue || a.amount))
        .slice(0, 5);

      holdings.push(...tokenHoldings);
    }

    return holdings.slice(0, 6); // Return top 6 holdings
  }

  /**
   * Analyze ecosystem interactions from Enhanced Transactions API data
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
      // Check accountData from Enhanced Transactions API
      const accountData = tx.accountData || [];

      for (const account of accountData) {
        for (const [ecosystemKey, ecosystem] of Object.entries(ECOSYSTEMS)) {
          if (ecosystem.programIds.includes(account.account)) {
            ecosystemCounts[ecosystem.name] =
              (ecosystemCounts[ecosystem.name] || 0) + 1;
            break; // Count once per transaction
          }
        }
      }

      // Check instructions
      const instructions = tx.instructions || [];
      for (const instruction of instructions) {
        for (const [ecosystemKey, ecosystem] of Object.entries(ECOSYSTEMS)) {
          if (ecosystem.programIds.includes(instruction.programId)) {
            ecosystemCounts[ecosystem.name] =
              (ecosystemCounts[ecosystem.name] || 0) + 1;
            break; // Count once per transaction
          }
        }
      }

      // Check native transfers and token transfers
      const nativeTransfers = tx.nativeTransfers || [];
      const tokenTransfers = tx.tokenTransfers || [];

      // Check if transaction involves known program IDs
      if (tx.type) {
        // Enhanced API provides transaction type which can help identify ecosystems
        for (const [ecosystemKey, ecosystem] of Object.entries(ECOSYSTEMS)) {
          const transactionData = JSON.stringify(tx);
          for (const programId of ecosystem.programIds) {
            if (transactionData.includes(programId)) {
              ecosystemCounts[ecosystem.name] =
                (ecosystemCounts[ecosystem.name] || 0) + 1;
              break;
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
