import type { TokenList } from "@uniswap/token-lists";

export const tokenList = {
  name: "Example Token List",
  timestamp: "2025-02-26T17:18:40.778Z",
  version: {
    major: 0,
    minor: 0,
    patch: 1,
  },
  tags: {
    stablecoin: {
      name: "Stablecoin",
      description:
        "Tokens that are fixed to an external asset, e.g. the US dollar",
    },
  },
  tokens: [
    {
      chainId: 1,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      extensions: {
        exampleExtension: "some value",
      },
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      tags: ["stablecoin"],
    },
    {
      chainId: 8453,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoURI: "",
    },
  ],
} as const satisfies TokenList;

export type TokenListType = typeof tokenList;
