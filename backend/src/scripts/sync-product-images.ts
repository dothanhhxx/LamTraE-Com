/**
 * Cập nhật ảnh sản phẩm (ph + gallery) và thêm sản phẩm mới từ DEFAULT_PRODUCTS vào kho đang dùng
 * (Supabase nếu có cấu hình, ngược lại là backend/data/products.json).
 * Giữ nguyên giá, tồn kho, trạng thái mà quản trị viên đã chỉnh.
 *
 *   npx tsx src/scripts/sync-product-images.ts
 */
import { JsonStore } from "../infrastructure/persistence/json-store.js";
import { DEFAULT_PRODUCTS } from "../modules/products/default-products.js";
import type { Product } from "../shared/types/product.types.js";

const IMAGE_SLUGS = ["tra-dinh-sen", "tra-moc-cau", "tra-non-tom"];
const NEW_SLUGS = ["tra-nhai", "tra-thanh-nhiet-duong-tam"];

async function main() {
  const list = await JsonStore.readJson<Product[]>("products.json", []);
  const def = (slug: string) => DEFAULT_PRODUCTS.find((p) => p.slug === slug)!;

  for (const slug of IMAGE_SLUGS) {
    const p = list.find((x) => x.slug === slug);
    if (!p) continue;
    p.ph = def(slug).ph;
    p.gallery = def(slug).gallery;
    console.log(`  ảnh  ${slug} (${p.gallery.length + 1} ảnh)`);
  }
  for (const slug of NEW_SLUGS) {
    if (list.some((x) => x.slug === slug)) continue;
    list.push({ ...def(slug), active: true, deleted: false });
    console.log(`  thêm ${slug}`);
  }
  await JsonStore.writeJson("products.json", list);
  console.log("✔ Xong");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
