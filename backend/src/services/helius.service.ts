import axios from 'axios';
import { ECOSYSTEMS, getWhaleTier } from '../config/ecosystems';

const HELIUS_RPC_URL = 'https://mainnet.helius-rpc.com';
const HELIUS_API_URL = 'https://api-mainnet.helius-rpc.com/v0';
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
  highestValueToken: {
    symbol: string;
    name: string;
    amount: number;
    usdValue: number;
  } | null;
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
    const highestValueToken = this.getHighestValueToken(topHoldings);
    const topEcosystems = this.analyzeEcosystems(transactions);

    return {
      address,
      ogStatus,
      lastSeen,
      whaleStatus,
      topHoldings,
      highestValueToken,
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
   * Get transaction history using getTransactionsForAddress RPC method
   */
  private async getTransactions(address: string): Promise<any[]> {
    try {
      // Use the getTransactionsForAddress RPC method for better control
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: "2.0",
        id: 1,
        method: "getTransactionsForAddress",
        params: [
          address,
          {
            transactionDetails: "full",
            sortOrder: "desc", // Most recent first
            limit: 100,
            filters: {
              status: "succeeded", // Only successful transactions
            },
          },
        ],
        
      });

      return response.data.result?.data || [];
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

    // Transactions are ordered newest first (desc), so get the last one
    const firstTx = transactions[transactions.length - 1];
    // blockTime is in Unix timestamp (seconds)
    const blockTime = firstTx.blockTime || firstTx.timestamp;
    const firstDate = new Date(blockTime * 1000);
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

    // First transaction in the array is the most recent (desc order)
    const lastTx = transactions[0];
    // blockTime is in Unix timestamp (seconds)
    const blockTime = lastTx.blockTime || lastTx.timestamp;
    const lastDate = new Date(blockTime * 1000);
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
   * Get the token with the highest dollar value
   */
  private getHighestValueToken(
    holdings: Array<{
      symbol: string;
      name: string;
      amount: number;
      usdValue?: number;
    }>
  ): {
    symbol: string;
    name: string;
    amount: number;
    usdValue: number;
  } | null {
    if (!holdings || holdings.length === 0) {
      return null;
    }

    // Filter holdings that have a USD value
    const holdingsWithValue = holdings.filter(
      (holding) => holding.usdValue !== undefined && holding.usdValue > 0
    );

    if (holdingsWithValue.length === 0) {
      return null;
    }

    // Find the token with the highest USD value
    const highest = holdingsWithValue.reduce((max, current) => {
      return (current.usdValue || 0) > (max.usdValue || 0) ? current : max;
    });

    return {
      symbol: highest.symbol,
      name: highest.name,
      amount: highest.amount,
      usdValue: highest.usdValue || 0,
    };
  }

  /**
   * Analyze ecosystem interactions from transaction data
   */
  private analyzeEcosystems(transactions: any[]): Array<{
    name: string;
    interactionCount: number;
  }> {
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;

    // Filter transactions from last 30 days
    const recentTransactions = transactions.filter((tx) => {
      const blockTime = tx.blockTime || tx.timestamp;
      return blockTime >= thirtyDaysAgo;
    });

    // Count interactions with each ecosystem
    const ecosystemCounts: Record<string, number> = {};

    for (const tx of recentTransactions) {
      const txEcosystems = new Set<string>(); // Track ecosystems per transaction

      // Get account keys from transaction message
      const accountKeys =
        tx.transaction?.message?.accountKeys ||
        tx.accountData ||
        [];

      // Check account keys for known program IDs
      for (const accountKey of accountKeys) {
        const address = typeof accountKey === 'string' ? accountKey : accountKey.pubkey || accountKey.account;

        for (const ecosystem of Object.values(ECOSYSTEMS)) {
          if (ecosystem.programIds.includes(address)) {
            txEcosystems.add(ecosystem.name);
          }
        }
      }

      // Check instructions for program IDs
      const instructions =
        tx.transaction?.message?.instructions ||
        tx.instructions ||
        [];

      for (const instruction of instructions) {
        const programId = instruction.programId || instruction.program;

        for (const ecosystem of Object.values(ECOSYSTEMS)) {
          if (ecosystem.programIds.includes(programId)) {
            txEcosystems.add(ecosystem.name);
          }
        }
      }

      // Increment count for each unique ecosystem in this transaction
      for (const ecosystemName of txEcosystems) {
        ecosystemCounts[ecosystemName] =
          (ecosystemCounts[ecosystemName] || 0) + 1;
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
