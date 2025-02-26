import type { TokenList } from "@uniswap/token-lists";

export const tokenList = {
  name: "Example Token List",
  timestamp: "2025-02-26T13:10:54.357Z",
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
  ],
} as const satisfies TokenList;

export type TokenListType = typeof tokenList;
