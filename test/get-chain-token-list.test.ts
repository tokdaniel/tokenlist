import * as fc from "fast-check";
import {
  existingChainIdArbitrary,
  invalidChainIdArbitrary,
  tagArbitrary,
} from "./arbitrary";
import { tokenList } from "../src/tokenlist.json";
import { getChainTokenList } from "../src";

describe("getChaintokenList", () => {
  it("should accept any value but return an empty array for it", () => {
    fc.assert(
      fc.property(fc.anything(), (anyVal) => {
        expect(getChainTokenList(anyVal)).toEqual([]);
      }),
    );
  });

  it("should return all tokens for a valid chainId", () => {
    fc.assert(
      fc.property(existingChainIdArbitrary, (chainId) => {
        const expectedTokens = tokenList.tokens.filter(
          (token) => token.chainId === chainId,
        );
        const result = getChainTokenList(chainId);
        expect(result).toEqual(expectedTokens);
      }),
    );
  });

  it("should return tokens filtered by tags", () => {
    fc.assert(
      fc.property(existingChainIdArbitrary, tagArbitrary, (chainId, tags) => {
        const expectedTokens = tokenList.tokens.filter(
          (token) =>
            token.chainId === chainId &&
            (tags.length === 0 ||
              ("tags" in token &&
                Array.isArray(token.tags) &&
                token.tags.some((tag) => tags.includes(tag)))),
        );

        const result = getChainTokenList(chainId, tags);
        expect(result).toEqual(expectedTokens);
      }),
      { verbose: true },
    );
  });

  it("should return an empty array for an invalid chainId", () => {
    fc.assert(
      fc.property(invalidChainIdArbitrary, (chainId) => {
        const result = getChainTokenList(chainId);
        expect(result).toEqual([]);
      }),
    );
  });
});
