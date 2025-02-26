#!/usr/bin/env node

import { build } from "tsup";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
	try {
		// Build using tsup
		await build({
			entry: ["bin/create.ts", "bin/add-token.ts"],
			format: ["esm"],
			clean: true,
			outDir: "dist/bin",
			platform: "node",
			target: "node18",
			shims: true,
		});

		// Make the output files executable
		const files = ["create.js", "add-token.js"];
		for (const file of files) {
			const filePath = path.join(process.cwd(), "dist/bin", file);
			await fs.chmod(filePath, 0o755);
		}

		console.log("✨ CLI scripts built successfully!");
	} catch (error) {
		console.error("❌ Error building CLI:", error);
		process.exit(1);
	}
}

main().catch(console.error);
