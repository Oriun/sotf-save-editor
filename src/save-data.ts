import Unzipper from "unzipper";
import Archiver from "archiver";
import fs from "fs";

export default class SaveData {
  archiver: Archiver.Archiver;
  constructor(
    public readonly zipPath: string,
    public readonly tempPath: string
  ) {
    this.archiver = Archiver("zip", {
      zlib: { level: 8 },
      store: false,
    });
  }
  backup() {
    fs.copyFileSync(this.zipPath, `${this.zipPath}.backup`);
  }
  unzip() {
    try {
      fs.rmSync(this.tempPath, { recursive: true, force: true });
    } catch {}

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(this.zipPath, { autoClose: true })
        .on("error", reject)
        .pipe(Unzipper.Extract({ path: this.tempPath, forceStream: true }))
        .on("error", reject)
        .on("close", resolve);
    });
  }
  zip() {
    return new Promise<void>((resolve, reject) => {
      setImmediate(() => {
        console.log("Zipping...");
        const stream = fs.createWriteStream(this.zipPath);
        this.archiver
          .directory(this.tempPath, false)
          .on("error", (err: unknown) => reject(err))
          .pipe(stream);

        stream.on("close", () => resolve());
        this.archiver.finalize();
      });
    });
  }
  listFiles() {
    return fs.readdirSync(this.tempPath);
  }
  read(fileType: string) {
    console.log(`Reading ${this.tempPath}/${fileType}SaveData.json`);
    const content = fs.readFileSync(
      `${this.tempPath}/${fileType}SaveData.json`,
      "utf-8"
    );
    const data = JSON.parse(content).Data[fileType];
    return JSON.parse(data);
  }
  update(fileType: string, data: Record<string, any>) {
    const content = fs.readFileSync(
      `${this.tempPath}/${fileType}SaveData.json`,
      "utf-8"
    );
    const json = JSON.parse(content);
    json.Data[fileType] = JSON.stringify(data);
    fs.writeFileSync(
      `${this.tempPath}/${fileType}SaveData.json`,
      JSON.stringify(json)
    );
  }
}
