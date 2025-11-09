/**
 * Ecosystem presets with their associated contract addresses
 * These are well-known Solana protocols and their program IDs
 */

export interface Ecosystem {
  name: string;
  programIds: string[];
  description: string;
}

export const ECOSYSTEMS: Record<string, Ecosystem> = {
  DEFI: {
    name: "DeFi",
    programIds: [
      "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", // Jupiter Aggregator
      "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB", // Jupiter V4
      "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc", // Orca Whirlpool
      "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP", // Orca V2
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8", // Raydium AMM
      "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK", // Raydium CLMM
      "MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky", // Marinade Finance
      "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo", // Solend
      "SWiMDJYFUGj6cPrQ6QYYYWZtvXQdRChSVAygDZDsCHC", // Switchboard
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // Token Program (for swaps)
    ],
    description: "Decentralized Finance",
  },
  NFT: {
    name: "NFT",
    programIds: [
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K", // Magic Eden V2
      "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8", // Magic Eden
      "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz", // Solanart
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s", // Metaplex Token Metadata
      "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk", // Auction House
      "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ", // Candy Machine V2
      "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY", // Bubblegum (Compressed NFTs)
    ],
    description: "NFT Marketplaces and Minting",
  },
  GAMING: {
    name: "Gaming",
    programIds: [
      "BAP315i1xoAXqbJcTT1LrUS45N3tAQnNnPuNQkCcvbAr", // Star Atlas
      "DRAWwhN14K1JBxjhJoeFwtW15MH1fF6fVBJJMFJL9Vrx", // DRAAW
      "GENEUpG4Ncpjy3kTpVYCy3EhLGYqWQeFWLTe6H8QYZBv", // Genopets
      "AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP", // Aurory
      "minrmrZmwNZfpEqLhvuHjyFLwM7LPbuRXJjBFkHbQFk", // Miner Rush
    ],
    description: "Gaming and Metaverse",
  },
  LENDING: {
    name: "Lending",
    programIds: [
      "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo", // Solend
      "LENDhNTBsv7vqMBnxd6EMUxzQeYmLmT4fCQ2XKTYH8e", // Port Finance
      "JD3bq9hGdy38PuWQ4h2YJpELmHVGPPfFSuFkpzAd9zfu", // Jet Protocol
      "Kao1i4r9DzqJZjsRn5K3WaqaSLqN56q1RRZfKvPy1Ux", // Apricot Finance
    ],
    description: "Lending Protocols",
  },
  SOCIAL: {
    name: "Social",
    programIds: [
      "4bK6fgAJmBMGGc9u7eZxBE4rQ92rLDKvTZEJ3gKQXEJh", // Dialect
      "SNSaTQw4KZNYR1P1aq8TjqHBGZFZMJZw5pf5Jvp3pump", // SNS (Solana Name Service)
      "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX", // Bonfida Name Service
      "TipszqJXxKzr5qW3hQQzLsjtzBdCZfUjnxJyQRvPPsc", // Tiplink
    ],
    description: "Social and Identity",
  },
  STAKING: {
    name: "Staking",
    programIds: [
      "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD", // Marinade
      "LidoLiquidStaking11111111111111111111111111", // Lido
      "SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy", // Socean
      "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", // Jito
      "Stake11111111111111111111111111111111111111", // Native Staking
    ],
    description: "Liquid Staking",
  },
};

/**
 * Get whale tier based on SOL balance
 */
export function getWhaleTier(solBalance: number): string {
  if (solBalance >= 100000) return "Kraken";
  if (solBalance >= 10000) return "Whale";
  if (solBalance >= 1000) return "Shark";
  if (solBalance >= 100) return "Dolphin";
  return "Fish";
}
