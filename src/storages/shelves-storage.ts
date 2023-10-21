import { z } from "zod";
import { positionSchema, rotationSchema, storageSchema } from "./schemas";
import { StorageStructure } from "./storage";
import { StorageItem } from "./storage-item";
import { ITEMS } from "./item";

export class ShelvesStorage extends StorageStructure {
  static Id = 49;
  static defaultStorageItemId: ITEMS = ITEMS.STICK; // TODO: Change to batteries
  static readonly Size = {
    x: 3,
    y: 3,
    z: 0.5,
  };
  constructor(
    public readonly Pos: z.infer<typeof positionSchema>,
    ItemBlocks: StorageItem[] = [],
    public readonly Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {
    super(
      ShelvesStorage.Id,
      Pos,
      ItemBlocks.map((block) => ({
        Version: "0.0.0",
        ItemBlocks: [block],
      })),
      Rot
    );
  }

  static fromRaw(
    Pos: z.infer<typeof positionSchema>,
    Storages: z.infer<typeof storageSchema>[] = [],
    Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {
    const storage = new ShelvesStorage(Pos, [], Rot);
    storage.Storages.push(...Storages);
    return storage;
  }
}
