import type { TokenInfo } from "@uniswap/token-lists";
import { checksumAddress, isAddress } from "viem";
import { tokenList } from "./tokenlist.json";
import type {
  AddressByChain,
  ChainId,
  ListedToken,
  SymbolsByChain,
  Tags,
  TokenAddressMap,
  TokenAddressMapByChain,
  TokensByChain,
  TokenSymbolMap,
  TokenSymbolMapByChain,
  U2I,
} from "./types";

/**
 * Compare two Ethereum addresses case-insensitively.
 * @param a - First address to compare.
 * @param b - Second address to compare.
 * @returns Returns true if both addresses are valid and equal, false otherwise.
 * @example
 * isAddressEqual('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48')
 * // Returns true.
 */
export const isAddressEqual = (a: unknown, b: unknown) =>
  typeof a === "string" &&
  typeof b === "string" &&
  isAddress(a, { strict: false }) &&
  isAddress(b, { strict: false }) &&
  a.toLowerCase() === b.toLowerCase();

/**
 * Validates if the given parameter adheres to the Uniswap's {@link TokenInfo} interface.
 * @param token - The value to test.
 * @returns Returns true if the parameter is a valid Uniswap standard {@link TokenInfo} object.
 */
export const isToken = (token: unknown): token is TokenInfo => {
  if (typeof token !== "object" || !token) return false;
  if (!("chainId" in token) || typeof token.chainId !== "number") return false;
  if (
    !("address" in token) ||
    typeof token.address !== "string" ||
    !isAddress(token.address, { strict: false })
  )
    return false;
  if (!("name" in token) || typeof token.name !== "string") return false;
  if (!("symbol" in token) || typeof token.symbol !== "string") return false;
  if (!("decimals" in token) || typeof token.decimals !== "number")
    return false;

  return true;
};

/**
 * Compares two tokens based on their chainId and address.
 * @param a - First token to compare.
 * @param b - Second token to compare.
 * @returns Returns true if the tokens are equal.
 * @example
 * isTokenEqual(tokenA, tokenB)
 * // Returns true if both tokens have the same chainId and address.
 */
export const isTokenEqual = (a: unknown, b: unknown) => {
  if (isToken(a) && isToken(b)) {
    return a.chainId === b.chainId && isAddressEqual(a.address, b.address);
  }

  return false;
};

/**
 * Checks if the provided parameter adheres to the {@link ListedToken} interface.
 * @param token - Value to validate.
 * @returns True if the token is listed.
 */
export const isListedToken = (token: unknown): token is ListedToken =>
  isToken(token) &&
  Boolean(
    token.chainId in tokenSymbolMap &&
      token.symbol in tokenSymbolMap[token.chainId as ChainId],
  );

/**
 * Generates a nested map with {@link ChainId} as key and address as secondary key.
 * @example
 * tokenAddressMap[1]['0x6b175474e89094c44da98b954eedeac495271d0f']
 * // Returns DAI token on Ethereum.
 */
export const tokenAddressMap = tokenList.tokens.reduce((acc, token) => {
  const { chainId, address } = token;

  if (!acc[chainId]) {
    acc[chainId] = {} as U2I<{ [C in ChainId]: TokenAddressMap<C> }[ChainId]>;
  }

  //@ts-ignore - Symbol type is too broad for this, thus typescript cannot infer, since chainId and address are not linked
  acc[chainId][address] = token;

  return acc;
}, {} as TokenAddressMapByChain);

/**
 * Retrieve a token by its chainId and address.
 * @param {C} chainId - the {@link ChainId} on which the token is expected to be found.
 * @param {A} address - the address of the token to look for
 * @returns {ListedToken | null} The token, or null if not found.
 * @example
 * getTokenByChainAndAddress(1, '0x54ee8a49155f701f0d5ff088cd36fbbf1a5b9f44'); // Returns USDC token on Ethereum.
 * const network: number = 5/5 // resolves to 1
 * getTokenByChainAndSymbol(network, '0x54ee8a49155f701f0d5ff088cd36fbbf1a5b9f44');
 * // Returns USDC token on Ethereum, but the type will be a union of all possible tokens with the same addres.
 */
export function getTokenByChainAndAddress<
  C extends ChainId,
  A extends AddressByChain<C>,
>(chainId: C, symbol: A): Extract<ListedToken, { chainId: C; address: A }>;

export function getTokenByChainAndAddress<C extends ChainId>(
  chainId: C,
  address: unknown,
): Extract<ListedToken, { chainId: C }> | null;

export function getTokenByChainAndAddress<A extends AddressByChain<ChainId>>(
  chainId: unknown,
  address: A,
): Extract<ListedToken, { address: A }> | null;

export function getTokenByChainAndAddress(
  chainId: unknown,
  address: unknown,
): ListedToken | null;

export function getTokenByChainAndAddress(
  chainId: unknown,
  address: unknown,
): ListedToken | null {
  if (
    typeof chainId === "number" &&
    typeof address === "string" &&
    chainId in tokenAddressMap &&
    isAddress(address, { strict: false })
  ) {
    const tokenMapByChain = tokenAddressMap[chainId as ChainId];

    const addr = checksumAddress(address);

    if (addr in tokenMapByChain) {
      return tokenMapByChain[
        addr as keyof typeof tokenMapByChain
      ] as ListedToken;
    }
  }

  return null;
}

/**
 * Retrieve a token by its chainId and address. Curried version of {@link getTokenByChainAndAddress}.
 * @param {C} chainId - the {@link ChainId} on which the token is expected to be found.
 * @param {A} address - the address of the token to look for
 * @returns {ListedToken | null} The token, or null if not found.
 * @example
 * getTokenByChainAndAddress(1, '0x54ee8a49155f701f0d5ff088cd36fbbf1a5b9f44'); // Returns USDC token on Ethereum.
 * const network: number = 5/5 // resolves to 1
 * getTokenByChainAndSymbol(network, '0x54ee8a49155f701f0d5ff088cd36fbbf1a5b9f44');
 * // Returns USDC token on Ethereum, but the type will be a union of all possible tokens with the same addres.
 */
export function getTokenByChainAndAddressCurried<C extends ChainId>(
  chainId: C,
): <A extends AddressByChain<C>>(
  address: A,
) => Extract<ListedToken, { chainId: C; address: A }>;

export function getTokenByChainAndAddressCurried<C extends ChainId>(
  chainId: C,
): (address: unknown) => Extract<ListedToken, { chainId: C }> | null;

export function getTokenByChainAndAddressCurried(
  chainId: unknown,
): <A extends AddressByChain<ChainId>>(
  address: A,
) => Extract<ListedToken, { address: A }> | null;

export function getTokenByChainAndAddressCurried(
  chainId: unknown,
): (address: unknown) => ListedToken | null;

// Implementation
export function getTokenByChainAndAddressCurried(chainId: unknown) {
  return <A extends AddressByChain<ChainId>>(
    address: A,
  ): ListedToken | null => {
    if (
      typeof chainId === "number" &&
      typeof address === "string" &&
      chainId in tokenAddressMap &&
      isAddress(address, { strict: false })
    ) {
      const tokenMapByChain = tokenAddressMap[chainId as ChainId];
      const addr = checksumAddress(address);

      if (addr in tokenMapByChain) {
        return tokenMapByChain[
          addr as keyof typeof tokenMapByChain
        ] as ListedToken;
      }
    }
    return null;
  };
}

/**
 * Generates a nested map with {@link ChainId} as key and {@link SymbolsByChain} as secondary key.
 */
export const tokenSymbolMap = tokenList.tokens.reduce((acc, token) => {
  const { chainId, symbol } = token;

  if (!acc[chainId]) {
    acc[chainId] = {} as U2I<{ [C in ChainId]: TokenSymbolMap<C> }[ChainId]>;
  }

  //@ts-ignore - Symbol type is too broad for this, thus typescript cannot infer, since chainId and symbol are not linked
  acc[chainId][symbol] = token;

  return acc;
}, {} as TokenSymbolMapByChain);

/**
 * Retrieve a token by its chainId and symbol.
 * @param {C} chainId - the {@link ChainId} on which the token is expected to be found.
 * @param {S} symbol - the symbol of the token to look for
 * @returns {ListedToken | null} The token, or null if not found.
 * @example
 * getTokenByChainAndSymbol(1, 'USDC'); // Returns USDC token on Ethereum.
 *
 * const network: number = 5/5 // resolves to 1
 * getTokenByChainAndSymbol(network, 'USDC');
 * // Returns USDT token on Ethereum, but the type will be a union of all possible USDC tokens.
 */
export function getTokenByChainAndSymbol<
  C extends ChainId,
  S extends SymbolsByChain<C>,
>(chainId: C, symbol: S): Extract<ListedToken, { chainId: C; symbol: S }>;

export function getTokenByChainAndSymbol<C extends ChainId>(
  chainId: C,
  symbol: unknown,
): Extract<ListedToken, { chainId: C }> | null;

export function getTokenByChainAndSymbol<S extends SymbolsByChain<ChainId>>(
  chainId: unknown,
  symbol: S,
): Extract<ListedToken, { symbol: S }> | null;

export function getTokenByChainAndSymbol(
  chainId: unknown,
  symbol: unknown,
): ListedToken | null;

export function getTokenByChainAndSymbol(chainId: unknown, symbol: unknown) {
  if (
    typeof chainId === "number" &&
    typeof symbol === "string" &&
    chainId in tokenSymbolMap
  ) {
    const tokenMapByChain = tokenSymbolMap[chainId as ChainId];

    if (symbol in tokenMapByChain) {
      return tokenMapByChain[
        symbol as keyof typeof tokenMapByChain
      ] as ListedToken;
    }
  }

  return null;
}

/**
 * Retriveve a token by its chainId and symbol. Curried version of {@link getTokenByChainAndSymbol}
 * @param {C} chainId - the {@link ChainId} on which the token is expected to be found.
 * @param {S} symbol - the symbol of the token to look for
 * @returns {ListedToken | null} The token, or null if not found.
 * @example
 * getTokenByChainAndSymbol(1)('USDC'); // Returns USDC token on Ethereum.
 *
 * const network: number = 5/5 // resolves to 1
 * getTokenByChainAndSymbol(network)('USDC');
 * // Returns USDT token on Ethereum, but the type will be a union of all possible USDC tokens.
 */
export function getTokenByChainAndSymbolCurried<C extends ChainId>(
  chainId: C,
): <S extends SymbolsByChain<C>>(
  symbol: S,
) => Extract<ListedToken, { chainId: C; symbol: S }>;

export function getTokenByChainAndSymbolCurried<C extends ChainId>(
  chainId: C,
): (symbol: string) => Extract<ListedToken, { chainId: C }> | null;

export function getTokenByChainAndSymbolCurried(
  chainId: unknown,
): <S extends SymbolsByChain<ChainId>>(
  symbol: S,
) => Extract<ListedToken, { symbol: S }> | null;

export function getTokenByChainAndSymbolCurried(
  chainId: unknown,
): (symbol: unknown) => ListedToken | null;

export function getTokenByChainAndSymbolCurried(chainId: unknown) {
  return <S extends SymbolsByChain<ChainId>>(symbol: S): ListedToken | null => {
    if (
      typeof chainId === "number" &&
      typeof symbol === "string" &&
      chainId in tokenSymbolMap
    ) {
      const tokenMapByChain = tokenSymbolMap[chainId as ChainId];

      if (symbol in tokenMapByChain) {
        return tokenMapByChain[
          symbol as keyof typeof tokenMapByChain
        ] as ListedToken;
      }
    }
    return null;
  };
}

/**
 * Fetches the list of all tokens for a specific chain.
 * @param chainId - The {@link ChainId} to filter tokens.
 * @param [tags] - Optional {@link Tags}[] to filter tokens by tags.
 * @returns - {@link ListedToken}[]
 * @example
 * getChainTokenList(1)
 * // Returns all tokens for Ethereum chain.
 * getChainTokenList(1, ['currency'])
 * // Returns all currency tokens for Ethereum chain.
 */
export function getChainTokenList<C extends ChainId>(
  chainId: C,
  tags?: Tags[],
): TokensByChain<ListedToken, C>[];

export function getChainTokenList(
  chainId: unknown,
  tags?: Tags[],
): ListedToken[];

export function getChainTokenList(
  chainId: unknown,
  tags: Tags[] = [],
): ListedToken[] {
  if (typeof chainId === "number" && chainId in tokenSymbolMap) {
    return tokenList.tokens.filter(
      (t) =>
        t.chainId === chainId &&
        (tags.length === 0 ||
          ("tags" in t && t.tags.some((tag) => tags.includes(tag)))),
    ) as ListedToken[];
  }
  return [];
}
