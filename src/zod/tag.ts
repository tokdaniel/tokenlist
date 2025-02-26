import { z } from "zod";

export const TagIdentifierSchema = z
	.string()
	.min(1, "Tag identifier must be at least 1 character long")
	.max(10, "Tag identifier must be at most 10 characters long")
	.regex(
		/^[\w]+$/,
		"Tag identifier must only contain alphanumeric characters and underscores",
	)
	.describe("The unique identifier of a tag");

export const TagDefinitionSchema = z
	.object({
		name: z
			.string()
			.min(1, { message: "Name must be at least 1 character long" })
			.max(20, { message: "Name must be no more than 20 characters long" })
			.regex(/^[ \w]+$/, {
				message:
					"Name can only contain letters, numbers, underscores, and spaces",
			}),
		description: z
			.string()
			.min(1, { message: "Description must be at least 1 character long" })
			.max(200, {
				message: "Description must be no more than 200 characters long",
			})
			.regex(/^[ \w\.,:\s]+$/, {
				message:
					"Description can only contain letters, numbers, underscores, spaces, periods, commas, and colons",
			}),
	})
	.strict();
