import type { TokenListType } from "./tokenlist.json";

export type U2I<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;

export type GetExt<T, K> = T extends {
  extensions: { [key in K]: infer L };
}
  ? L
  : never;

/**
 * {@link Tags} - A union of strings that represent all possible token tags
 */
export type Tags = keyof TokenListType["tags"];
/**
 * {@link ListedToken} - A union of all tokens in the tokenlist
 */
export type ListedToken = TokenListType["tokens"][number];

/**
 * {@link ChainId} - A union of all possible chainIds in the tokenlist
 */
export type ChainId = ListedToken["chainId"];
/**
 * {@link Symbol_} - A union of all possible symbols in the tokenlist
 */
export type Symbol_ = ListedToken["symbol"];

/**
 * {@link AddressByChain}<{@link ChainId}> - A union of all addresses in the tokenlist for a given chainId
 */
export type AddressByChain<C extends ChainId> = Extract<
  ListedToken,
  { chainId: C }
>["address"];

/**
 * {@link SymbolsByChain}<{@link ChainId}> - A union of all symbols in the tokenlist for a given chainId
 */
export type SymbolsByChain<C extends ChainId> = Extract<
  ListedToken,
  { chainId: C }
>["symbol"];

/**
 * {@link TokensByChain}<{@link ChainId}> - A union of all tokens in the tokenlist for a given chainId
 */
export type TokensByChain<T, Id extends ChainId> = T extends { chainId: Id }
  ? T
  : never;

/**
 * {@link TokenSymbolMap}<{@link ChainId}> - A map of all tokens in the tokenlist for a given chainId by symbol
 */
export type TokenSymbolMap<C extends ChainId> = {
  [S in Extract<ListedToken, { chainId: C }>["symbol"]]: Extract<
    ListedToken,
    { chainId: C; symbol: S }
  >;
};

/**
 * {@link TokenAddressMap}<{@link ChainId}> - A map of all tokens in the tokenlist for a given chainId by address
 */
export type TokenAddressMap<C extends ChainId> = {
  [A in Extract<ListedToken, { chainId: C }>["address"]]: Extract<
    ListedToken,
    { chainId: C; address: A }
  >;
};

/**
 * {@link TokenSymbolMapByChain} - A nested map of all possible chains, with a map of all tokens in the tokenlist for a given chainId by symbol
 */
export type TokenSymbolMapByChain = {
  [K in ListedToken["chainId"]]: TokenSymbolMap<K>;
};

/**
 * {@link TokenAddressMapByChain} - A nested map of all possible chains, with a map of all tokens in the tokenlist for a given chainId by address
 */
export type TokenAddressMapByChain = {
  [K in ListedToken["chainId"]]: TokenAddressMap<K>;
};
