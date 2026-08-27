import { z } from "zod";

// =======================================
// Primitives
// =======================================

export const UUIDSchema = z.string().uuid({
  message: "Invalid UUID format",
});

export const IsoDatetimeSchema = z.iso.datetime({
  message: "Invalid ISO datetime format",
});

export const IsoDateSchema = z.iso.date({
  message: "Invalid ISO date format",
});

export const UrlSchema = z.string().url({
  message: "Invalid URL format",
});

// =======================================
// String Formats
// =======================================

export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Invalid slug",
});

export const SearchQuerySchema = z
  .string()
  .max(100, {
    message: "Search query cannot exceed 100 characters",
  })
  .optional();

// =======================================
// Numbers
// =======================================

export const NonNegativeIntSchema = z.coerce.number().int().nonnegative({
  message: "Amount cannot be less than 0",
});

export const DecimalSchema = z
  .number()
  .nonnegative()
  .refine((value) => Number.isInteger(value * 100), {
    message: "Number cannot have more than 2 decimal places",
  });

// =======================================
// Geographic Coordinates
// =======================================

export const LatitudeSchema = z
  .number()
  .min(-90, {
    message: "Latitude must be at least -90",
  })
  .max(90, {
    message: "Latitude cannot exceed 90",
  });

export const LongitudeSchema = z
  .number()
  .min(-180, {
    message: "Longitude must be at least -180",
  })
  .max(180, {
    message: "Longitude cannot exceed 180",
  });

// =======================================
// Images
// =======================================

export const ImageUrlSchema = z.string().url({
  message: "Invalid URL format",
});

export const ImagePublicIdSchema = z.string().min(1);

// =======================================
// Sorting
// =======================================

export const SortOrderSchema = z.enum(["desc", "asc"], {
  message: "Invalid sort order",
});

// =======================================
// Pagination
// =======================================

export const PaginationQuerySchema = z.object({
  page: NonNegativeIntSchema.default(1),
  limit: NonNegativeIntSchema.max(100, {
    message: "Limit cannot exceed 100",
  }).default(10),
});

export const PaginationResultSchema = PaginationQuerySchema.extend({
  total: NonNegativeIntSchema.default(0),
  total_pages: NonNegativeIntSchema.default(0),
});

// =======================================
// Update Results
// =======================================

export const UpdateResultSchema = z.object({
  old_values: z.record,
  new_values: z.record,
});
