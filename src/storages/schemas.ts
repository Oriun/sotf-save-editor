import { z } from "zod";

export const rotationSchema = z.strictObject({
    w: z.number(),
    y: z.number().optional(),
    z: z.number().optional(),
    x: z.number().optional()
})

export const positionSchema = z.strictObject({
    x: z.number(),
    y: z.number(),
    z: z.number(),
})

export const storageItemSchema = z.strictObject({
    ItemId: z.number().int(),
    TotalCount: z.number().int(),
    UniqueItems: z.strictObject({}).array(),
})

export const storageSchema = z.strictObject({
    Version: z.string(),
    ItemBlocks: storageItemSchema.array(),
})

export const screwStructureInstancesSchema = z.object({
  _structures: z.strictObject({
    Id: z.number().int(),
    Pos: positionSchema,
    Rot: rotationSchema,
    Storages: storageSchema.array()
  }).array(),
});
