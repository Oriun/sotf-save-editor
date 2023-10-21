import { z } from "zod";
import { positionSchema, rotationSchema, storageSchema } from "./schemas";
import { StorageStructure } from "./storage";
import { StorageItem } from "./storage-item";
import { ITEMS } from "./item";

export class LogStorage extends StorageStructure {
  static Id = 67;
  static defaultStorageItemId: ITEMS = ITEMS.LOG;
  static readonly Size = {
    x: 3,
    y: 3,
    z: 3,
  };
  constructor(
    public readonly Pos: z.infer<typeof positionSchema>,
    ItemBlocks: StorageItem[] = [],
    public readonly Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {
    super(
      LogStorage.Id,
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
    const storage = new LogStorage(Pos, [], Rot);
    storage.Storages.push(...Storages);
    return storage;
  }
}
