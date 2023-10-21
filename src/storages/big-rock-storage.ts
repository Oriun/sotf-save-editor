import { z } from "zod";
import { positionSchema, rotationSchema, storageSchema } from "./schemas";
import { StorageStructure } from "./storage";
import { StorageItem } from "./storage-item";
import { ITEMS } from "./item";

export class BigRockStorage extends StorageStructure {
  static Id = 62;
  static defaultStorageItemId: ITEMS = ITEMS.BIG_ROCK;
  static readonly Size = {
    x: 2,
    y: 2,
    z: 1.5,
  };
  constructor(
    public readonly Pos: z.infer<typeof positionSchema>,
    ItemBlocks: StorageItem[] = [],
    public readonly Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {
    super(
      BigRockStorage.Id,
      Pos,
      ItemBlocks.length
        ? [
            {
              Version: "0.0.0",
              ItemBlocks,
            },
          ]
        : [],
      Rot
    );
  }

  static fromRaw(
    Pos: z.infer<typeof positionSchema>,
    Storages: z.infer<typeof storageSchema>[] = [],
    Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {
    const storage = new BigRockStorage(Pos, [], Rot);
    storage.Storages.push(...Storages);
    return storage;
  }
}
