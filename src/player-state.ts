import { z } from "zod";
import SaveData from "./save-data";

export default class PlayerState extends Map<string, TEntry> {
  static readonly FILENAME = "PlayerState";
  private readonly rawData: any;
  private _saveImmediate: NodeJS.Immediate | null = null;
  get saveImmediate() {
    return this._saveImmediate;
  }
  set saveImmediate(value) {
    if (this._saveImmediate) clearImmediate(this._saveImmediate);
    this._saveImmediate = value;
  }
  constructor(private readonly saveData: SaveData) {
    super();
    const data = saveData.read(PlayerState.FILENAME);
    this.rawData = playerStateSchema.parse(data);
    for (const entry of this.rawData._entries) {
      super.set(entry.Name, entry);
    }
  }
  set(_: string, __: TEntry): never {
    throw new Error("Unauthorized, use setValue instead");
  }
  setValue(value: TEntry) {
    this.saveImmediate = setImmediate(() => {
      this.save();
    });
    const { Name } = value;
    const entry = super.get(Name);
    if (!entry) return super.set(Name, value);
    for (const _key of Object.keys(entry)) {
      const key = _key as keyof typeof entry;
      entry[key] = value[key] ?? entry[key];
    }
    return this;
  }
  save() {
    console.log("Saving PlayerState...");
    const data = this.rawData;
    data._entries = [...this.values()];
    this.saveData.update(PlayerState.FILENAME, data);
    if (this.saveImmediate) clearImmediate(this.saveImmediate);
    return this;
  }
  maxHealth() {
    this.setValue({ Name: "MaxHealth", FloatValue: 2100 });
    this.setValue({ Name: "CurrentHealth", FloatValue: 2100 });
    this.setValue({ Name: "TargetHealth", FloatValue: 2100 });
    return this;
  }
}

const namedSchema = z.strictObject({
  Name: z.string(),
});

const settingSchema = namedSchema.merge(
  z.strictObject({
    SettingType: z.number(),
  })
);

const boolSchema = namedSchema.merge(
  z.strictObject({
    BoolValue: z.boolean(),
  })
);

const intSchema = settingSchema.merge(
  z.strictObject({
    IntValue: z.number().int(),
  })
);

const floatSchema = settingSchema.merge(
  z.strictObject({
    FloatValue: z.number(),
  })
);

const floatArraySchema = settingSchema.merge(
  z.strictObject({
    FloatArrayValue: z.number().array(),
  })
);

const entrySchema = z.union([
  boolSchema,
  namedSchema,
  settingSchema,
  intSchema,
  floatSchema,
  floatArraySchema,
]);

type TEntry = z.infer<typeof entrySchema>;

const playerStateSchema = z.object({
  _entries: entrySchema.array(),
  NamedInts: z
    .strictObject({
      SaveObjectNameId: z.string(),
    })
    .array(),
});
