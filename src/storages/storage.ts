import { z } from "zod";
import { positionSchema, rotationSchema, storageSchema } from "./schemas";
import { StorageItem } from "./storage-item";
import { ITEMS } from "./item";

export class StorageStructure {
  static defaultStorageItemId: ITEMS = ITEMS.LOG;
  constructor(
    public readonly Id: number,
    public readonly Pos: z.infer<typeof positionSchema>,
    public readonly Storages: z.infer<typeof storageSchema>[] = [],
    public readonly Rot: z.infer<typeof rotationSchema> = { w: 1 }
  ) {}

  fill() {
    const filledStorage = this.Storages.map((storage) => ({
      ...storage,
      ItemBlocks: storage.ItemBlocks.map((block) => ({
        ...block,
        TotalCount: 999,
      })),
    }));
    this.Storages.splice(0, this.Storages.length, ...filledStorage);
    return this;
  }

  empty() {
    this.Storages.splice(0, this.Storages.length);
    return this;
  }

  add(item: StorageItem) {
    const storage = this.Storages[0];
    if (!storage) {
      this.Storages.push({
        Version: "0.0.0",
        ItemBlocks: [item],
      });
    } else {
      storage.ItemBlocks.push(item);
    }
    return this;
  }
}
