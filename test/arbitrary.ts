import { isAddressEqual } from "../src";
import fc from "fast-check";
import { checksumAddress, type Address } from "viem";
import { tokenList } from "../src/tokenlist.json";

export function hexa(): fc.Arbitrary<string> {
  return fc.integer({ min: 0, max: 15 }).map((n) => "0123456789abcdef"[n]);
}

export function hexaString(
  constraints: fc.StringConstraints = {},
): fc.Arbitrary<Address> {
  return fc.string({ ...constraints, unit: hexa() }) as fc.Arbitrary<Address>;
}

export const ethAddressArbitrary = (): fc.Arbitrary<`0x${string}`> =>
  hexaString({ minLength: 40, maxLength: 40 }).map(
    (address) => `0x${address.toLowerCase()}` as const,
  );

export const checksummedEthAddressArbitrary = (): fc.Arbitrary<string> =>
  ethAddressArbitrary().map(checksumAddress);

export const validTokenArbitrary = fc.record({
  chainId: fc.integer({ min: 1 }),
  address: ethAddressArbitrary(),
  name: fc.string({ minLength: 1 }),
  symbol: fc.string({ minLength: 1, maxLength: 10 }),
  decimals: fc.integer({ min: 1, max: 18 }),
});

export const invalidTokenArbitrary = fc.oneof(
  fc.record({
    chainId: fc.anything(),
    address: fc.anything(),
    name: fc.anything(),
    symbol: fc.anything(),
    decimals: fc.anything(),
  }),
  fc.record({
    chainId: fc.integer(),
    address: fc.oneof(
      fc.string({ minLength: 5, maxLength: 30 }),
      fc.anything(),
    ),
    name: fc.string(),
    symbol: fc.string(),
    decimals: fc.integer(),
  }),
  fc.record({
    chainId: fc.integer(),
    address: ethAddressArbitrary(),
    name: fc.string(),
    symbol: fc.string(),
    decimals: fc.oneof(fc.string(), fc.constant(null), fc.constant(undefined)),
  }),

  fc.record({
    chainId: fc.integer(),
    address: ethAddressArbitrary(),
    name: fc.oneof(fc.integer(), fc.constant(null), fc.constant(undefined)),
    symbol: fc.string(),
    decimals: fc.integer(),
  }),
  fc.record({
    chainId: fc.integer(),
    address: ethAddressArbitrary(),
    name: fc.string(),
    symbol: fc.oneof(fc.integer(), fc.constant(null), fc.constant(undefined)),
    decimals: fc.integer(),
  }),
);

export const symbolArbitrary = fc.constantFrom(
  ...tokenList.tokens.map((t) => t.symbol),
);

export const addressArbitrary = fc.constantFrom(
  ...tokenList.tokens.map((t) => t.address),
);

export const differentTokenArbitrary = fc
  .tuple(validTokenArbitrary, validTokenArbitrary)
  .filter(([tokenA, tokenB]) => {
    return (
      tokenA.chainId !== tokenB.chainId ||
      !isAddressEqual(tokenA.address, tokenB.address)
    );
  });

export const listedTokenArbitrary = fc.constantFrom(...tokenList.tokens);

export const unlistedTokenArbitrary = fc
  .record({
    chainId: fc.integer({ min: 1 }),
    address: ethAddressArbitrary(),
    name: fc.string({ minLength: 1 }),
    symbol: fc.string({ minLength: 1, maxLength: 10 }),
    decimals: fc.integer({ min: 0, max: 18 }),
  })
  .filter(
    (token) =>
      !tokenList.tokens.some(
        (listedToken) =>
          listedToken.chainId === token.chainId &&
          listedToken.address.toLowerCase() === token.address.toLowerCase(),
      ),
  );

export const existingChainIdArbitrary = fc.constantFrom(
  ...tokenList.tokens.map((token) => token.chainId),
);

export const invalidChainIdArbitrary = fc.integer({ min: 1000000 });

export const tagArbitrary = fc.array(
  fc.constantFrom(
    ...tokenList.tokens.flatMap((token) => ("tags" in token ? token.tags : [])),
  ),
);
