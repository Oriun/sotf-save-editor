import deepEqual from "deep-equal";
import PlayerState from "./src/player-state";
import SaveData from "./src/save-data";
import StoragesList from "./src/storages";
import { ITEMS } from "./src/storages/item";
import { LogStorage } from "./src/storages/log-storage";
import { StorageItem } from "./src/storages/storage-item";
import { StickStorage } from "./src/storages/stick-storage";
import { storageIdMap } from "./src/storages/storage-id-map";
import { BigRockStorage } from "./src/storages/big-rock-storage";

async function main() {
  const save = new SaveData(
    "/Users/emmanuelnuiro/Library/Containers/com.isaacmarovitz.Whisky/Bottles/33CDB5EC-3D88-440B-9E15-F4CA95A2780A/drive_c/users/crossover/AppData/LocalLow/Endnight/SonsOfTheForest/Saves/76561199106224246/Multiplayer/0670427138/SaveData.zip",
    "./tmp"
  );
    // save.backup()
  await save.unzip();
  console.log("Save Unzipped");

  new PlayerState(save)
    .maxHealth()
    .setValue({ Name: "Strength", FloatValue: 1_000 })
    .setValue({ Name: "StrengthLevel", IntValue: 1_000 })
    .setValue({ Name: "CurrentStrength", IntValue: 1_000 })
    .setValue({ Name: "RequiredCurrentStrengthPerLevel", IntValue: 1 })
    .setValue({ Name: "Rest", FloatValue: 100 })
    .setValue({ Name: "Stamina", FloatValue: 100 })
    .setValue({ Name: "HydrationBuff", FloatValue: 100 })
    .setValue({ Name: "FullnessBuff", FloatValue: 100 })
    .setValue({ Name: "RestBuff", FloatValue: 100 })
    .setValue({
      Name: "player.position",
      FloatArrayValue: [1023.39429, 244.845016, -618.443237],
    });

  const storages = new StoragesList(save);

  storages.fillAll(LogStorage, StickStorage, BigRockStorage);

  const pos = {
    x: 1005,
    y: 244.500015,
    z: -623,
  };
  storages.remove((storage) => deepEqual(storage.Pos, pos));
  storages.add(new LogStorage(pos, [new StorageItem(ITEMS.LOG)]));

  researches(storages);
  await save.zip();
  console.log("Save Zipped !");
}

main();

function sortPositions(
  a: { Pos: { x: number; y: number; z: number } },
  b: { Pos: { x: number; y: number; z: number } }
) {
  if (a.Pos.x < b.Pos.x) return -1;
  if (a.Pos.x > b.Pos.x) return 1;
  if (a.Pos.z < b.Pos.z) return -1;
  if (a.Pos.z > b.Pos.z) return 1;
  return 0;
}

function researches(storages: StoragesList) {
  const precision = 1;
  console.log(
    storages
      .filter((storage) => storage.Id === StickStorage.Id)
      .sort(sortPositions)
      .map((s) => ({
        x: Math.round(s.Pos.x * precision) / precision,
        y: Math.round(s.Pos.y * precision) / precision,
        z: Math.round(s.Pos.z * precision) / precision,
      }))
  );
  console.log(
    storages.filter((storage) => storage.Id === StickStorage.Id).length
  );
  console.log(
    storages
      .filter((storage) => storage.Id === BigRockStorage.Id)
      .sort(sortPositions)
      .map((s) => ({
        x: Math.round(s.Pos.x * precision) / precision,
        y: Math.round(s.Pos.y * precision) / precision,
        z: Math.round(s.Pos.z * precision) / precision,
      }))
  );
  console.log(
    storages.filter((storage) => storage.Id === BigRockStorage.Id).length
  );

  /**
   * 2 x 9 rectangle of stick storages
   * (x: 1024, z: -616) -> (x: 1032, z: -618)
   *
   * 5 x 5 square of big rock storages
   * (x: 1010, z: -606) -> (x: 1018, z: -612)
   *
   * 1 cube (walls + ceiling) -> 3 x 3 x 3
   * 1 floor -> 3 x 0.5 x 3
   */
}
