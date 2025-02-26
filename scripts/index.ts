import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "./validate";
import { tokenList } from "@/src/tokenlist.json";
import { updateTokenListVersion } from "./version";
import { TOKENLIST_NAME } from "@/config/filenames";
import TokenListSchema from "@/src/zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  await validate(tokenList);

  try {
    const tokenListBase = TokenListSchema.parse(
      fs.readFileSync(path.resolve(__dirname, `../${TOKENLIST_NAME}`), "utf-8"),
    );

    const updated = updateTokenListVersion(tokenListBase, tokenList, {
      major: false,
      minor: false,
      patch: false,
    });

    fs.writeFileSync(
      path.resolve(__dirname, `../${TOKENLIST_NAME}`),
      JSON.stringify(updated, null, 2),
    );
  } catch {
    console.log(`${TOKENLIST_NAME} not found, proceeding with current list.`);
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../${TOKENLIST_NAME}`),
    JSON.stringify(tokenList, null, 2),
  );
};

run();
