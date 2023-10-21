import { ITEMS } from "./item";

export class StorageItem {
    constructor(
      public readonly ItemId: ITEMS,
      public readonly TotalCount: number = 999,
      public readonly UniqueItems: any[] = []
    ) {}
  }