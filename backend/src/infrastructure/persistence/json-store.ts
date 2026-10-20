import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../../config/env.js";

export class JsonStore {
  private static async ensureDir(): Promise<void> {
    await mkdir(ENV.DATA_DIR, { recursive: true }).catch(() => {});
  }

  static getFilePath(filename: string): string {
    return path.join(ENV.DATA_DIR, filename);
  }

  static async readJson<T>(filename: string, fallback: T): Promise<T> {
    await this.ensureDir();
    try {
      const content = await readFile(this.getFilePath(filename), "utf8");
      return JSON.parse(content) as T;
    } catch {
      return fallback;
    }
  }

  static async writeJson<T>(filename: string, data: T): Promise<void> {
    await this.ensureDir();
    const content = JSON.stringify(data, null, 2);
    await writeFile(this.getFilePath(filename), content, "utf8");
  }

  static async readJsonl<T>(filename: string): Promise<T[]> {
    await this.ensureDir();
    try {
      const raw = await readFile(this.getFilePath(filename), "utf8");
      return raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as T);
    } catch {
      return [];
    }
  }

  static async appendJsonl(filename: string, record: object): Promise<void> {
    await this.ensureDir();
    await appendFile(this.getFilePath(filename), JSON.stringify(record) + "\n", "utf8");
  }
}
