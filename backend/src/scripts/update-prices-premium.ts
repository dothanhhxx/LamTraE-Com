/**
 * Áp bảng giá Premium (giá hộp 200g) và đổi cỡ 150/300/500g -> 100/200/500g cho kho đang dùng
 * (Supabase nếu có cấu hình, ngược lại backend/data/products.json).
 * Chỉ đổi giá 4 sản phẩm trong PRICES và khoá tồn kho theo cỡ; giữ nguyên trạng thái, số lượng.
 *
 *   npx tsx src/scripts/update-prices-premium.ts --dry   # chỉ in thay đổi, không ghi
 *   npx tsx src/scripts/update-prices-premium.ts
 */
import { JsonStore } from "../infrastructure/persistence/json-store.js";
import type { Product } from "../shared/types/product.types.js";

const PRICES: Record<string, number> = {
  "tra-non-tom": 249000,
  "tra-moc-cau": 219000,
  "tra-nhai": 289000,
  "tra-dinh-sen": 559000,
};
// Khoá tồn kho "size|grade": 150g nay là hộp 200g; 300g không còn bán nên bỏ.
const SIZE_MAP: Record<string, string | null> = { "150": "200", "300": null };
const dry = process.argv.includes("--dry");

async function main() {
  const list = await JsonStore.readJson<Product[]>("products.json", []);
  if (list.length === 0) {
    console.log("Kho trống, không có gì để cập nhật.");
    return;
  }
  for (const p of list) {
    const base = PRICES[p.slug];
    if (base !== undefined && p.base !== base) {
      console.log(`  giá  ${p.slug}: ${p.base} -> ${base}`);
      p.base = base;
      if (p.compareAt !== undefined && p.compareAt <= base) {
        console.log(`       bỏ compareAt ${p.compareAt} (không còn lớn hơn giá mới)`);
        delete p.compareAt;
      }
    }
    if (p.stock) {
      const next: Record<string, number> = {};
      for (const [key, qty] of Object.entries(p.stock)) {
        const [size, grade] = key.split("|");
        const mapped = size in SIZE_MAP ? SIZE_MAP[size] : size;
        if (mapped === null) {
          console.log(`  kho  ${p.slug}: bỏ ${key}=${qty}`);
          continue;
        }
        const nk = `${mapped}|${grade}`;
        if (nk !== key) console.log(`  kho  ${p.slug}: ${key} -> ${nk}`);
        next[nk] = qty;
      }
      p.stock = next;
    }
  }
  if (dry) {
    console.log("(--dry: chưa ghi)");
    return;
  }
  await JsonStore.writeJson("products.json", list);
  console.log("✔ Đã ghi vào kho:", await JsonStore.ping());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
