import { z } from "zod";

export const ExtensionIdentifierSchema = z
	.string()
	.min(1, "Extension identifier must be at least 1 character long")
	.max(40, "Extension identifier must be at most 40 characters long")
	.regex(
		/^[\w]+$/,
		"Extension identifier must only contain alphanumeric characters and underscores",
	)
	.describe("The name of a token extension property");

export const ExtensionPrimitiveValueSchema = z.union([
	z.string().min(1).max(42),
	z.boolean(),
	z.number(),
	z.null(),
]);

export const ExtensionValueInner1Schema = ExtensionPrimitiveValueSchema;

export const ExtensionValueInner0 = z.union([
	ExtensionPrimitiveValueSchema,
	z
		.record(ExtensionIdentifierSchema, ExtensionValueInner1Schema)
		.refine((obj) => Object.keys(obj).length <= 10, {
			message: "Object cannot have more than 10 properties",
		}),
]);

export const ExtensionValueSchema = z.union([
	ExtensionPrimitiveValueSchema,
	z
		.record(ExtensionIdentifierSchema, ExtensionValueInner0)
		.refine((obj) => Object.keys(obj).length <= 10, {
			message: "Object cannot have more than 10 properties",
		}),
]);

export const ExtensionMapSchema = z
	.record(ExtensionIdentifierSchema, ExtensionValueSchema)
	.refine((obj) => Object.keys(obj).length <= 10, {
		message: "ExtensionMap cannot have more than 10 properties",
	});
