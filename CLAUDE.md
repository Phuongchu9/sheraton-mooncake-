# CLAUDE.md

## Project

Landing page bán bánh trung thu Sheraton Hà Nội. Node.js + Express, không dùng framework frontend.

## Quy tắc chỉnh sửa

- Không rewrite toàn bộ file — chỉ trả về phần code cần thêm hoặc sửa
- Không thêm comment giải thích code trừ khi logic phức tạp
- Không thêm tính năng ngoài yêu cầu

## Stack

- **Backend:** Node.js, Express
- **Database:** JSON file (`orders.json`)
- **Frontend:** Vanilla HTML/CSS/JS (không dùng framework)
- **Deploy:** Render (Node web service)

## Cấu trúc quan trọng

- `server.js` — API routes, email notification
- `db.js` — CRUD operations trên `orders.json`
- `public/index.html` — Trang chủ (nền trắng, tone kem/ivory)
- `public/admin.html` — Dashboard quản lý đơn (dark theme)
- `public/images/` — Ảnh banner hero + ảnh sản phẩm

## Lưu ý

- Ảnh hero slideshow: 10 file JPG/PNG trong `public/images/`
- Ảnh sản phẩm: tỉ lệ 1:1 (vuông), dùng `aspect-ratio: 1/1`
- `orders.json` bị gitignore — không commit dữ liệu đơn hàng
- Admin password lưu trong `.env` → biến `ADMIN_PASSWORD`
