import { z } from "zod";
import { positionSchema, rotationSchema, storageSchema } from "./schemas";
import { StorageStructure } from "./storage";
import { StorageItem } from "./storage-item";
import { ITEMS } from "./item";

export class RockStorage extends StorageStructure {
  static Id = 31;
  static defaultStorageItemId: ITEMS = ITEMS.ROCK;
  static readonly Size = {
    x: 1,
    y: 2,
    z: 1,
  };
  constructor(
    public readonly Pos: z.infer<typeof positionSchema>,
    ItemBlocks: StorageItem[] = [],
    public readonly Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {
    super(
      RockStorage.Id,
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
    const storage = new RockStorage(Pos, [], Rot);
    storage.Storages.push(...Storages);
    return storage;
  }
}
