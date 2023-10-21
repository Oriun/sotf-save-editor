import { LogStorage } from "./log-storage";
import { BigRockStorage } from "./big-rock-storage";
import { StickStorage } from "./stick-storage";
import { RockStorage } from "./rock-storage";
import { ShelvesStorage } from "./shelves-storage";

const storagesClasses = [
  LogStorage,
  StickStorage,
  BigRockStorage,
  RockStorage,
  ShelvesStorage,
] as const;
export const storageIdMap = new Map(
  storagesClasses.map((storageClass) => [storageClass.Id, storageClass])
);
