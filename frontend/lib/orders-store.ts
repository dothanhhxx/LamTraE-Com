// Đơn hàng và sổ địa chỉ đã dùng trên thiết bị này (localStorage).
// Giai đoạn 3 có tài khoản thì lấy từ server; hiện dùng để xem lại đơn, mua lại và điền nhanh địa chỉ.
import type { Order } from "./checkout";
import { readJSON, writeJSON } from "./storage";

const ORDERS_KEY = "lamtra-orders-v1";
const ADDR_KEY = "lamtra-addresses-v1";

export type SavedAddress = { name: string; phone: string; email?: string; province: string; address: string };

export const localOrders = () => readJSON<Order[]>(ORDERS_KEY, []);
export const localOrder = (code: string) => localOrders().find((o) => o.code === code);

export function saveLocalOrder(o: Order) {
  writeJSON(ORDERS_KEY, [o, ...localOrders().filter((x) => x.code !== o.code)].slice(0, 30));
}

export function patchLocalOrder(code: string, patch: Partial<Order>) {
  writeJSON(ORDERS_KEY, localOrders().map((o) => (o.code === code ? { ...o, ...patch } : o)));
}

export const savedAddresses = () => readJSON<SavedAddress[]>(ADDR_KEY, []);

export function saveAddress(a: SavedAddress) {
  const same = (x: SavedAddress) => x.phone === a.phone && x.address === a.address && x.province === a.province;
  writeJSON(ADDR_KEY, [a, ...savedAddresses().filter((x) => !same(x))].slice(0, 5));
}

export function removeAddress(i: number) {
  writeJSON(ADDR_KEY, savedAddresses().filter((_, j) => j !== i));
}
