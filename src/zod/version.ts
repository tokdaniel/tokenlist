import { z } from "zod";

export const VersionSchema = z
	.object({
		major: z
			.number()
			.int()
			.min(0)
			.describe(
				"The major version of the list. Must be incremented when tokens are removed from the list or token addresses are changed.",
			),

		minor: z
			.number()
			.int()
			.min(0)
			.describe(
				"The minor version of the list. Must be incremented when tokens are added to the list.",
			),

		patch: z
			.number()
			.int()
			.min(0)
			.describe(
				"The patch version of the list. Must be incremented for any changes to the list.",
			),
	})
	.strict();
