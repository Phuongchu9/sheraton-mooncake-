# PLAN.md – Sheraton Mooncake

## 1. Gửi Email Xác Nhận Cho Khách

**Mục tiêu:** Sau khi khách đặt hàng thành công, tự động gửi email xác nhận kèm thông tin đơn.

### Việc cần làm
- [ ] Thiết kế template email xác nhận (HTML) cho khách hàng
- [ ] Thêm field `email` bắt buộc hoặc tuỳ chọn trong form đặt hàng
- [ ] Trong `server.js`: sau khi `db.insert()` thành công, gọi thêm `sendConfirmationToCustomer(order)`
- [ ] Nội dung email: tên, sản phẩm, số lượng, hotline liên hệ, thời gian nhận hàng dự kiến

### Lưu ý
- Nodemailer đã có sẵn trong project, chỉ cần thêm hàm mới
- Cần cấu hình `SMTP_USER`, `SMTP_PASS` trong `.env` (đã có sẵn biến)

---

## 2. Tích Hợp Thanh Toán Online

**Mục tiêu:** Khách có thể thanh toán trực tuyến qua VNPay hoặc MoMo ngay trên web.

### Lựa chọn cổng thanh toán
| Cổng | Ưu điểm | Ghi chú |
|---|---|---|
| **VNPay** | Phổ biến nhất VN, hỗ trợ ATM/Visa/QR | Cần đăng ký merchant |
| **MoMo** | Ví điện tử phổ biến, QR nhanh | Cần đăng ký business |
| **Chuyển khoản QR** | Không cần đăng ký, setup nhanh | Thủ công, không tự động xác nhận |

### Giai đoạn 1 — Chuyển khoản QR (VietQR)
Không cần merchant account, tích hợp nhanh qua API ảnh của VietQR.io.

**Luồng hoạt động:**
1. Khách điền form → bấm "Gửi Đơn Hàng"
2. Server lưu đơn → trả về `{ id, amount }`
3. Frontend hiển thị modal thành công kèm:
   - Ảnh QR tự động sinh từ VietQR.io
   - Số tiền tự điền theo sản phẩm đã chọn
   - Nội dung chuyển khoản: `DH{id} {tên khách}`
   - Thông tin tài khoản ngân hàng

**URL sinh QR (không cần backend):**
```
https://img.vietqr.io/image/{BANK_ID}-{STK}-compact2.png
  ?amount={SO_TIEN}
  &addInfo=DH{id}%20{ten_khach}
  &accountName={TEN_TK}
```

**Việc cần làm:**
- [ ] Điền thông tin ngân hàng vào `.env`: `BANK_ID`, `BANK_ACCOUNT`, `BANK_NAME`
- [ ] Sửa modal thành công trong `index.html`: thêm khung hiển thị QR + số tài khoản
- [ ] Lấy giá sản phẩm từ dropdown đã chọn để điền `amount` vào QR URL
- [ ] Thêm nút "Đã chuyển khoản" → hiển thị thông báo chờ xác nhận
- [ ] Admin dashboard: thêm cột `payment_status` (Chờ TT / Đã TT / Đã xác nhận)
- [ ] Admin có thể bấm xác nhận thanh toán cho từng đơn

### Sau đó nâng lên VNPay (cần merchant account)
- [ ] Đăng ký tài khoản VNPay merchant tại vnpay.vn
- [ ] Cài `vnpay` npm package
- [ ] Thêm route `POST /api/payment/create` → redirect sang VNPay
- [ ] Thêm route `GET /api/payment/return` → nhận kết quả, cập nhật trạng thái đơn
- [ ] Cập nhật `db.js` thêm field `payment_status` cho mỗi đơn
- [ ] Hiển thị trạng thái thanh toán trong admin dashboard

---

## Thứ tự ưu tiên

1. **Email xác nhận** — nhanh, dùng code sẵn có, giá trị ngay
2. **QR chuyển khoản** — không cần đăng ký, ra mắt sớm
3. **VNPay** — sau khi có merchant account
