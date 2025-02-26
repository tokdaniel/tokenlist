import { tokenList } from "@/src";
import type { TokenList as UniswapTokenList } from "@uniswap/token-lists";
import { select, input, checkbox } from "@inquirer/prompts";
import * as chains from "viem/chains";
import { getContract, erc20Abi } from "viem";
import { getStaticClient } from "../config/network";
import ora from "ora";
import fs from "node:fs";
import path from "node:path";

const tokenlistPath = path.join(process.cwd(), "src", "tokenlist.json.ts");

type TokenDetails = {
  name: string;
  symbol: string;
  decimals: number;
};

async function fetchTokenDetails(
  chainId: number,
  address: string,
): Promise<TokenDetails> {
  const spinner = ora("Fetching token details...").start();

  try {
    const client = getStaticClient(chainId);
    if (!client) {
      spinner.fail("Chain not supported");
      throw new Error(`Chain ID ${chainId} not supported`);
    }

    const contract = getContract({
      address: address as `0x${string}`,
      abi: erc20Abi,
      client,
    });

    const [name, symbol, decimals] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
    ]);

    spinner.succeed("Token details fetched successfully!");

    return {
      name: String(name),
      symbol: String(symbol),
      decimals: Number(decimals),
    };
  } catch (error) {
    spinner.fail("Failed to fetch token details");
    throw error;
  }
}

interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

interface TagDefinition {
  name: string;
  description: string;
}

interface TokenList extends Omit<UniswapTokenList, "tokens"> {
  tokens: Token[];
  tags?: {
    [key: string]: TagDefinition;
  };
}

async function main() {
  const action = await select({
    message: "Welcome to the tokenlist CLI. Choose from the following actions:",
    choices: [
      { name: "Add a token", value: "add_token" },
      { name: "Remove a token", value: "remove_token" },
      { name: "Add a tag", value: "add_tag" },
      { name: "Remove tags", value: "remove_tags" },
    ],
  });

  switch (action) {
    case "add_token":
      await addToken();
      break;
    case "remove_token":
      await removeToken();
      break;
    case "add_tag":
      await addTag();
      break;
    case "remove_tags":
      await removeTags();
      break;
    default:
      console.log("Invalid action");
  }
}

async function removeToken() {
  const tokens = (tokenList as TokenList).tokens;
  let matchingTokens: Token[] = [];

  while (matchingTokens.length === 0) {
    const searchTerm = await input({
      message: "Enter the symbol or part of the symbol to search for:",
    });

    matchingTokens = tokens.filter((token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (matchingTokens.length === 0) {
      console.log("No matching tokens found. Please try again.");
    }
  }

  const tokenToRemove = await select({
    message: "Select the token to remove:",
    choices: matchingTokens.map((token) => ({
      name: `${token.symbol} (${token.name}) - Chain ID: ${token.chainId}`,
      value: token,
    })),
  });

  const newTokens = tokens.filter((token) => token !== tokenToRemove);

  const newList = JSON.stringify(
    {
      ...tokenList,
      tokens: newTokens,
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
    .replace(/"([^"]+)":/g, "$1:") // Remove quotes around property names
    .replace(/"/g, "'");

  try {
    const content = await fs.promises.readFile(tokenlistPath, "utf8");
    const updatedContent = content.replace(
      /export const tokenList = ({[\s\S]*?}) as const/,
      `export const tokenList = ${newList} as const`,
    );
    await fs.promises.writeFile(tokenlistPath, updatedContent, "utf8");
    console.log("Token removed successfully!");
  } catch (error) {
    console.error("Error updating tokenlist:", error);
  }
}

async function addTag() {
  const tagId = await input({
    message:
      "Enter tag identifier (alphanumeric and underscores only, max 10 chars):",
    validate: (value) =>
      /^[\w]{1,10}$/.test(value) ||
      "Tag identifier must be 1-10 characters long and contain only letters, numbers, and underscores",
  });

  const list = tokenList as TokenList;
  if (list.tags?.[tagId]) {
    console.log("Tag already exists!");
    return;
  }

  const tagDefinition: TagDefinition = {
    name: await input({
      message: "Enter tag name (max 20 chars):",
      validate: (value) =>
        /^[ \w]{1,20}$/.test(value) ||
        "Name must be 1-20 characters and contain only letters, numbers, underscores, and spaces",
    }),
    description: await input({
      message: "Enter tag description (max 200 chars):",
      validate: (value) =>
        /^[ \w\.,:\s]{1,200}$/.test(value) ||
        "Description must be 1-200 characters and contain only letters, numbers, underscores, spaces, and basic punctuation",
    }),
  };

  const newList = JSON.stringify(
    {
      ...list,
      tags: {
        ...(list.tags || {}),
        [tagId]: tagDefinition,
      },
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, "'");

  try {
    const content = await fs.promises.readFile(tokenlistPath, "utf8");
    const updatedContent = content.replace(
      /export const tokenList = ({[\s\S]*?}) as const/,
      `export const tokenList = ${newList} as const`,
    );
    await fs.promises.writeFile(tokenlistPath, updatedContent, "utf8");
    console.log("Tag added successfully!");
  } catch (error) {
    console.error("Error updating tokenlist:", error);
  }
}

async function removeTags() {
  const list = tokenList as TokenList;
  if (!list.tags || Object.keys(list.tags).length === 0) {
    console.log("No tags exist to remove!");
    return;
  }

  const existingTags = Object.entries(list.tags).map(([id, def]) => ({
    name: `${def.name} (${id}): ${def.description}`,
    value: id,
  }));

  const tagsToRemove = await checkbox({
    message: "Select tags to remove:",
    choices: existingTags,
  });

  if (tagsToRemove.length === 0) {
    console.log("No tags selected for removal.");
    return;
  }

  // Create new tags object without the selected tags
  const newTags = { ...list.tags };
  for (const tagId of tagsToRemove) {
    delete newTags[tagId];
  }

  // Remove the tags from all tokens that have them
  const updatedTokens = list.tokens.map((token) => {
    if (token.tags) {
      return {
        ...token,
        tags: token.tags.filter((tag) => !tagsToRemove.includes(tag)),
      };
    }
    return token;
  });

  const newList = JSON.stringify(
    {
      ...list,
      tags: newTags,
      tokens: updatedTokens,
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, "'");

  try {
    const content = await fs.promises.readFile(tokenlistPath, "utf8");
    const updatedContent = content.replace(
      /export const tokenList = ({[\s\S]*?}) as const/,
      `export const tokenList = ${newList}`,
    );
    await fs.promises.writeFile(tokenlistPath, updatedContent, "utf8");
    console.log("Tags removed successfully!");
  } catch (error) {
    console.error("Error updating tokenlist:", error);
  }
}

async function addToken() {
  const list = tokenList as TokenList;
  const existingTags = list.tags
    ? Object.entries(list.tags).map(([id, def]) => ({
        name: `${def.name} (${id}): ${def.description}`,
        value: id,
      }))
    : [];

  const searchTerm = await input({
    message: "Search for a network (e.g. 'ethereum', 'polygon'):",
  });

  const matchingChains = Object.entries(chains).filter(([name, chain]) =>
    name
      .toLowerCase()
      .concat(chain.name.toLocaleLowerCase())
      .includes(searchTerm.toLowerCase()),
  );

  if (matchingChains.length === 0) {
    console.log("No matching networks found. Please try again.");
    return;
  }

  const selectedChain = await select({
    message: "Select the network:",
    choices: matchingChains.map(([_, chain]) => ({
      name: `${chain.name} (Chain ID: ${chain.id})`,
      value: chain,
    })),
  });

  const address = await input({
    message: "Enter token address:",
    validate: (value) =>
      /^0x[a-fA-F0-9]{40}$/.test(value) ||
      "Please enter a valid Ethereum address",
  });

  let tokenDetails: TokenDetails | null = null;
  try {
    tokenDetails = await fetchTokenDetails(selectedChain.id, address);
  } catch (error) {
    console.log("Could not fetch token details. Please enter them manually.");
  }

  const newToken: Token = {
    chainId: selectedChain.id,
    address,
    name: await input({
      message: "Enter token name:",
      default: tokenDetails?.name,
    }),
    symbol: await input({
      message: "Enter token symbol:",
      default: tokenDetails?.symbol,
    }),
    decimals: Number.parseInt(
      await input({
        message: "Enter token decimals:",
        default: tokenDetails?.decimals?.toString(),
        validate: (value) => {
          const num = Number(value);
          return Boolean(value) &&
            !Number.isNaN(num) &&
            Number.isInteger(num) &&
            num >= 0 &&
            num <= 18
            ? true
            : "Please enter a valid integer between 0 and 18";
        },
      }),
    ),
    logoURI: await input({
      message: "Enter logo URI (optional):",
      default: "",
    }),
  };

  if (existingTags.length > 0) {
    const selectedTags = await checkbox({
      message: "Select tags for this token (optional):",
      choices: existingTags,
    });

    if (selectedTags.length > 0) {
      newToken.tags = selectedTags;
    }
  }

  const newList = JSON.stringify(
    {
      ...tokenList,
      tokens: (tokenList as TokenList).tokens.concat(newToken),
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  )
    .replace(/"([^"]+)":/g, "$1:") // Remove quotes around property names
    .replace(/"/g, "'");

  try {
    const content = await fs.promises.readFile(tokenlistPath, "utf8");
    const updatedContent = content.replace(
      /export const tokenList = ({[\s\S]*?}) as const/,
      `export const tokenList = ${newList} as const`,
    );
    await fs.promises.writeFile(tokenlistPath, updatedContent, "utf8");
    console.log("Token added successfully!");
  } catch (error) {
    console.error("Error updating tokenlist:", error);
  }
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error("An error occurred:", error.message);
  } else {
    console.error("An unknown error occurred");
  }
});
