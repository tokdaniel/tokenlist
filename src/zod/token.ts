import { z } from "zod";
import { ExtensionMapSchema } from "./extension"; // Assuming previous ExtensionMap definition
import { TagIdentifierSchema } from "./tag"; // You'll need to define this separately

export const TokenInfoSchema = z
	.object({
		chainId: z
			.number()
			.int()
			.min(1, { message: "Chain ID must be at least 1" }),

		address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
			message:
				"Address must be a valid 40-character hexadecimal address prefixed with 0x",
		}),

		decimals: z
			.number()
			.int()
			.min(0, { message: "Decimals must be at least 0" })
			.max(255, { message: "Decimals must be no more than 255" }),

		name: z
			.string()
			.max(60, { message: "Name must be no more than 60 characters" })
			.regex(/^$|^[ \S+]+$/, {
				message:
					"Name must be either empty or contain non-whitespace characters",
			}),

		symbol: z
			.string()
			.max(20, { message: "Symbol must be no more than 20 characters" })
			.regex(/^$|\S+$/, {
				message:
					"Symbol must be either empty or contain non-whitespace characters",
			}),

		logoURI: z.string().url({ message: "Must be a valid URL" }).optional(),

		tags: z
			.array(TagIdentifierSchema)
			.max(10, { message: "Maximum of 10 tags allowed" })
			.optional(),

		extensions: ExtensionMapSchema.optional(),
	})
	.strict()
	.required({
		chainId: true,
		address: true,
		decimals: true,
		name: true,
		symbol: true,
	});
