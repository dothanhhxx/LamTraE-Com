// Shared Product Types - Định nghĩa danh mục, trà, biến thể và thuộc tính

export type Category = {
  slug: string;
  name: string;
  desc: string;
  ph: string;
};

export type Purpose = "hang-ngay" | "bieu-tang";
export type Occasion = "tet" | "trung-thu" | "20-10" | "tan-gia";

export type Spec = {
  label: string;
  value: string;
};

export type Brew = {
  temp: string;
  amount: string;
  time: string;
  infusions: string;
  tip: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  note: string;
  base: number;
  compareAt?: number;
  /** Giá bán cơ sở phân hạng Tiêu chuẩn (200g), để trống sẽ tự động tính = 75% giá Premium */
  standardBase?: number;
  fixed?: boolean;
  rating: number;
  reviews: number;
  sold: number;
  isNew?: boolean;
  addedAt: string;
  origin: string;
  ph: string;
  /** Ảnh hộp phổ thông, hiện khi khách chọn hạng Tiêu chuẩn */
  standardPh?: string;
  /** Nhãn quy cách cho sản phẩm giá cố định, ví dụ "Hộp 20 túi lọc" */
  unit?: string;
  gallery: { ph: string; alt: string }[];
  /** Danh sách ảnh chi tiết / phụ phân hạng Tiêu chuẩn (nếu có) */
  standardGallery?: { ph: string; alt: string }[];
  desc: string;
  purposes: Purpose[];
  occasions: Occasion[];
  specs: Spec[];
  brew?: Brew;
  stock?: Record<string, number>;
  active?: boolean;
  deleted?: boolean;
};

export type ProductOverride = {
  base?: number;
  compareAt?: number;
  standardBase?: number;
  active?: boolean;
  stock?: Record<string, number>;
  updatedAt?: string;
};
