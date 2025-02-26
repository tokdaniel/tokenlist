import { tokenList } from "@/src/tokenlist.json";
import type { ChainId } from "@/src/types";
import { createClient, http, type Client } from "viem";
import * as chains from "viem/chains";

const listChains = Array.from(
	new Set(tokenList.tokens.map(({ chainId }) => chainId)),
);

export const staticClients = listChains.reduce(
	(acc, chainId) => {
		const client = createClient({
			batch: {
				multicall: true,
			},
			chain: Object.values(chains).find((c) => c.id === chainId),
			transport: http(),
		});

		return Object.assign(acc, { [chainId]: client });
	},
	{} as Record<ChainId, Client>,
);
