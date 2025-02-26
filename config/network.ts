import { createPublicClient, http } from "viem";
import * as chains from "viem/chains";

export const getStaticClient = (chainId: number) => {
  const client = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: Object.values(chains).find((c) => c.id === chainId),
    transport: http(),
  });

  return client;
};
