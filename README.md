# Lam Trà E-Commerce

## Cấu trúc thư mục

```
LamTraE-Com/
├── web/                    # Ứng dụng Next.js (source code chính)
│   ├── app/                #   App Router: layout, page, globals.css, design tokens (ds/)
│   ├── components/         #   ds/ (UI kit) · landing/ (trang landing)
│   └── public/assets/      #   Ảnh, logo dùng trên web
├── design/
│   ├── prototype/          # Bản thiết kế HTML (.dc.html) + design system (_ds/), assets, support.js
│   └── references/         # Ảnh chụp tham khảo / moodboard
├── brand/
│   └── logo/               # Logo gốc (SVG, avatar)
├── .gitignore
└── README.md
```

## Chạy dự án

```bash
cd web
npm install
npm run dev
```

Mở prototype: mở trực tiếp `design/prototype/lam-tra-landing-v2.dc.html` trên trình duyệt.
