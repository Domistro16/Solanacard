/**
 * App-specific configurations with their program IDs
 * These are well-known Solana applications and their on-chain program addresses
 */

export interface Ecosystem {
  name: string;
  programIds: string[];
  description: string;
}

export const ECOSYSTEMS: Record<string, Ecosystem> = {
  JUPITER: {
    name: "Jupiter",
    programIds: [
      "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
      "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB",
      "JUP3c2Uh3WA4Ng34ocd2GKh6Er6bgE7nxkhMeL2HkQmp",
    ],
    description: "DEX Aggregator",
  },
  RAYDIUM: {
    name: "Raydium",
    programIds: [
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
      "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
      "RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr",
    ],
    description: "AMM DEX",
  },
  ORCA: {
    name: "Orca",
    programIds: [
      "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
      "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
    ],
    description: "AMM DEX",
  },
  PUMP_FUN: {
    name: "Pump.fun",
    programIds: [
      "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      "PumpFunKEqN4kJLEzD9JFbVqSyJuPqxPwJsX5FQjf1",
    ],
    description: "Meme Coin Launchpad",
  },
  MAGIC_EDEN: {
    name: "Magic Eden",
    programIds: [
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K",
      "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8",
      "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix",
    ],
    description: "NFT Marketplace",
  },
  TENSOR: {
    name: "Tensor",
    programIds: [
      "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN",
      "TCMPhJdwDryooaGtiocG1u3xcYbRpiJzb283XfCZsDp",
    ],
    description: "NFT Marketplace",
  },
  METEORA: {
    name: "Meteora",
    programIds: [
      "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
      "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB",
    ],
    description: "Liquidity Protocol",
  },
  BAGS: {
    name: "Bags",
    programIds: [
      "FEEhPbKVKnco9EXnaY3i4R5rQVUx91wgVfu8qokixywi",
      "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG",
      "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN",
    ],
    description: "Token Launchpad",
  },
  MARINADE: {
    name: "Marinade",
    programIds: ["MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD"],
    description: "Liquid Staking",
  },
  JITO: {
    name: "Jito",
    programIds: [
      "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
      "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
    ],
    description: "MEV & Liquid Staking",
  },
  KAMINO: {
    name: "Kamino",
    programIds: [
      "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD",
      "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc",
    ],
    description: "Lending & Liquidity",
  },
  MARGINFI: {
    name: "MarginFi",
    programIds: ["MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA"],
    description: "Lending Protocol",
  },
  DRIFT: {
    name: "Drift",
    programIds: ["dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH"],
    description: "Perpetuals DEX",
  },
  PHOENIX: {
    name: "Phoenix",
    programIds: ["PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY"],
    description: "Orderbook DEX",
  },
  STAR_ATLAS: {
    name: "Star Atlas",
    programIds: [
      "BAP315i1xoAXqbJcTT1LrUS45N3tAQnNnPuNQkCcvbAr",
      "FLEET1qqzpexyaDpqb2DGsSzE2sDCizewCg9WjrA6DBW",
    ],
    description: "Gaming",
  },
  GENOPETS: {
    name: "Genopets",
    programIds: ["GENEUpG4Ncpjy3kTpVYCy3EhLGYqWQeFWLTe6H8QYZBv"],
    description: "Gaming",
  },
  BONFIDA: {
    name: "Bonfida",
    programIds: ["namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX"],
    description: "Name Service",
  },
  METAPLEX: {
    name: "Metaplex",
    programIds: [
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
      "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk",
      "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ",
      "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
    ],
    description: "NFT Infrastructure",
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
