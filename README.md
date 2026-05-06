# Sheraton Mooncake 🥮

Landing page bán bánh trung thu cao cấp Sheraton Hà Nội – Bộ sưu tập "Thu Sắc Kinh Kì" 2026.

## Tính năng

- Trang giới thiệu sản phẩm với hero slideshow ảnh thực tế
- Giỏ hàng (add/remove, lưu sessionStorage)
- Form đặt hàng
- Trang Admin quản lý đơn hàng
- Thông báo email khi có đơn mới (tuỳ chọn)

## Cài đặt

```bash
npm install
```

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

## Chạy local

```bash
npm run dev
```

Truy cập: http://localhost:3000

## Cấu trúc

```
sheraton-mooncake/
├── server.js          # Express server + API
├── db.js              # JSON file database
├── public/
│   ├── index.html     # Trang chủ
│   ├── admin.html     # Trang quản trị
│   └── images/        # Ảnh sản phẩm & banner
└── .env.example       # Mẫu biến môi trường
```

## Admin

URL: `/admin.html`  
Mật khẩu mặc định: `admin123` (đổi qua biến môi trường `ADMIN_PASSWORD`)

## Deploy

Hosted trên [Render](https://render.com):  
**https://sheraton-mooncake.onrender.com**
