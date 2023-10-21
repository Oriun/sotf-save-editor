import { z } from "zod";
import SaveData from "../save-data";
import { screwStructureInstancesSchema } from "./schemas";
import { StorageStructure } from "./storage";
import { storageIdMap } from "./storage-id-map";
import { writeFileSync } from "fs";
import { ValueOfMap } from "../utils";
import { StorageItem } from "./storage-item";

export default class StoragesList {
  static readonly FILENAME = "ScrewStructureInstances";
  private readonly rawData: z.infer<typeof screwStructureInstancesSchema>;
  storageList: StorageStructure[] = [];
  private _saveImmediate: NodeJS.Immediate | null = null;
  get saveImmediate() {
    return this._saveImmediate;
  }
  set saveImmediate(value) {
    if (this._saveImmediate) clearImmediate(this._saveImmediate);
    this._saveImmediate = value;
  }
  constructor(private readonly saveData: SaveData) {
    const data = saveData.read(StoragesList.FILENAME);
    this.rawData = screwStructureInstancesSchema.parse(data);
    writeFileSync("screw-structure-instances.json", JSON.stringify(this.rawData, null, 2));
    for (const entry of this.rawData._structures) {
      const knownStructure = storageIdMap.get(entry.Id);
      if (!knownStructure) {
        console.log("Unknown structure", entry.Id, entry.Pos)
        this.storageList.push(
          new StorageStructure(entry.Id, entry.Pos, entry.Storages, entry.Rot)
        );
      } else {
        const storage = knownStructure.fromRaw(
          entry.Pos,
          entry.Storages,
          entry.Rot
        );
        this.storageList.push(storage);
      }
    }
  }

  add(storage: StorageStructure) {
    this.storageList.push(storage);
    this.triggerSave();
    console.log("Added storage", storage);
    return this;
  }

  *get<T extends StorageStructure = StorageStructure>(id: number) {
    for (const storage of this.storageList) {
      if (storage.Id === id) yield storage as T;
    }
  }
  entries() {
    return this.storageList.entries();
  }
  items(){
    return this.storageList;
  }
  splice(index: number, deleteCount: number, ...items: StorageStructure[]) {
    this.storageList.splice(index, deleteCount, ...items);
    this.triggerSave();
    return this;
  }

  at(index: number) {
    return this.storageList[index];
  }

  size() {
    return this.storageList.length;
  }

  filter(predicate: (storage: StorageStructure) => boolean) {
    return this.storageList.filter(predicate);
  }

  find(predicate: (storage: StorageStructure) => boolean) {
    return this.storageList.find(predicate);
  }

  forEach(callbackfn: (storage: StorageStructure) => void) {
    this.storageList.forEach(callbackfn);
  }

  fillStorage(index: number) {
    const storage = this.storageList[index];
    if (!storage) return this;
    storage.fill();
    this.triggerSave();
    return this;
  }

  remove(where: (storage: StorageStructure) => boolean) {
    let index = -1;
    while(true) {
      index = this.storageList.findIndex(where);
      if (index === -1) break;
      this.storageList.splice(index, 1);
    }
    this.triggerSave();
    return this;
  }

  fillAll(...ids: ValueOfMap<typeof storageIdMap>[]) {
    for (const storage of this.storageList) {
      const storageClass = storageIdMap.get(storage.Id);
      if (storageClass && ids.includes(storageClass)) {
        storage.empty()
        storage.add(new StorageItem(storageClass.defaultStorageItemId))
        storage.fill()
      };
    }
    this.triggerSave();
    return this;
  }

  private triggerSave() {
    this.saveImmediate = setImmediate(() => {
      this.save();
    });
  }

  save() {
    console.log("Saving storages...");
    const newData = {
      _structures: this.storageList,
    }
    screwStructureInstancesSchema.parse(newData);
    this.saveData.update(StoragesList.FILENAME, newData);
    if (this.saveImmediate) clearImmediate(this.saveImmediate);
    return this;
  }
}
