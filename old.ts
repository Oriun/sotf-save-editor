import fs from "fs/promises";
import playwright from "playwright";
interface ItemBlock {
  ItemId: number;
  TotalCount: number;
  UniqueItems: {}[];
}

async function main() {
  const clean = JSON.parse(await fs.readFile("clean.json", "utf-8")) as {
    Version: string;
    Data: {
      PlayerInventory: string;
    };
  };
  const rawItems = JSON.parse(
    removeComments(await fs.readFile("items.jsonc", "utf-8"))
  ) as string[];

  const inventory = JSON.parse(clean.Data.PlayerInventory) as {
    Version: "0.0.0";
    QuickSelect: {
      Version: "0.0.0";
      Slots: [{}, {}, {}, {}, {}, {}, {}, {}, { ItemId: 589 }];
    };
    EquippedItems: [];
    ItemInstanceManagerData: {
      Version: "0.0.0";
      ItemBlocks: ItemBlock[];
    };
  };

  const itemBlocks = inventory.ItemInstanceManagerData
    .ItemBlocks as ItemBlock[];

  console.dir(itemBlocks, { depth: null });

  const itemIds = rawItems
    .map((item) => parseInt(item.split(" ").at(-1)!))
    .sort((a, b) => a - b);
  console.log(itemIds[0], itemIds.at(-1));

  console.log(
    itemBlocks.map((block) => ({
      ...block,
      name: rawItems.find((item) => item.endsWith("" + block.ItemId)),
    }))
  );

  itemBlocks.length = 0;

  for (const ItemId of itemIds) {
    if (itemBlocks.find((block) => block.ItemId === ItemId)) continue;
    itemBlocks.push({
      ItemId,
      TotalCount: 1_000,
      UniqueItems: [],
    });
  }

  clean.Data.PlayerInventory = JSON.stringify(inventory);

  await fs.writeFile("PlayerInventorySaveData.json", JSON.stringify(clean));
  await fs.writeFile(
    "/Users/emmanuelnuiro/Library/Containers/com.isaacmarovitz.Whisky/Bottles/33CDB5EC-3D88-440B-9E15-F4CA95A2780A/drive_c/users/crossover/AppData/LocalLow/Endnight/SonsOfTheForest/Saves/76561199106224246/Multiplayer/0670427138/SaveData/PlayerInventorySaveData.json",
    JSON.stringify(clean)
  );

  console.log(itemIds.length,"items")
  console.log("written, waiting for file change")
  const watcher = fs.watch("/Users/emmanuelnuiro/Downloads/ezyzip.zip");
  for await (const event of watcher) {
    console.log(event)
    const zip = await fs.readFile(
      "/Users/emmanuelnuiro/Downloads/ezyzip.zip"
    );
    await fs.writeFile(
      "/Users/emmanuelnuiro/Library/Containers/com.isaacmarovitz.Whisky/Bottles/33CDB5EC-3D88-440B-9E15-F4CA95A2780A/drive_c/users/crossover/AppData/LocalLow/Endnight/SonsOfTheForest/Saves/76561199106224246/Multiplayer/0670427138/SaveData.zip",
      zip
    );
    console.log("Saved");
    if(event.eventType === "rename") process.exit(0)
  }
}

main();

function removeComments(str: string) {
  let cleaned = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "/" && str[i + 1] === "/") {
      while (str[i] !== "\n") i++;
    } else {
      cleaned += str[i];
    }
  }
  return cleaned;
}
