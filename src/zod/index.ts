import { z } from "zod";
import { TokenInfoSchema } from "./token";
import { TagDefinitionSchema, TagIdentifierSchema } from "./tag";
import { VersionSchema } from "./version";

export * from "./extension";
export * from "./tag";
export * from "./token";
export * from "./version";

export const TokenListSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name must be at least 1 character long" })
      .max(30, { message: "Name must be no more than 30 characters long" })
      .regex(/^[\w ]+$/, {
        message:
          "Name can only contain letters, numbers, underscores, and spaces",
      }),
    timestamp: z.string().datetime({
      message: "Timestamp must be a valid ISO 8601 date-time string",
    }),
    version: VersionSchema,
    tokens: z
      .array(TokenInfoSchema)
      .min(1, { message: "At least one token is required" })
      .max(10000, { message: "Maximum of 10,000 tokens allowed" }),
    tokenMap: z
      .record(
        z.string().regex(/^\d+_0x[a-fA-F0-9]{40}$/, {
          message: "Token map key must be in format 'chainId_tokenAddress'",
        }),
        TokenInfoSchema,
      )
      .refine((obj) => Object.keys(obj).length >= 1, {
        message: "Token map must have at least one entry",
      })
      .refine((obj) => Object.keys(obj).length <= 10000, {
        message: "Maximum of 10,000 token map entries allowed",
      })
      .optional(),
    keywords: z
      .array(
        z
          .string()
          .min(1, { message: "Keyword must be at least 1 character long" })
          .max(20, {
            message: "Keyword must be no more than 20 characters long",
          })
          .regex(/^[\w ]+$/, {
            message:
              "Keyword can only contain letters, numbers, underscores, and spaces",
          }),
      )
      .max(20, { message: "Maximum of 20 keywords allowed" })
      .refine((keywords) => new Set(keywords).size === keywords.length, {
        message: "Keywords must be unique",
      })
      .optional(),
    tags: z
      .record(TagIdentifierSchema, TagDefinitionSchema)
      .refine((obj) => Object.keys(obj).length <= 20, {
        message: "Maximum of 20 tags allowed",
      })
      .optional(),
    logoURI: z.string().url({ message: "Must be a valid URL" }).optional(),
  })
  .strict()
  .required({
    name: true,
    timestamp: true,
    version: true,
    tokens: true,
  });

export default TokenListSchema;
