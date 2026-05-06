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

### Đề xuất: Bắt đầu với Chuyển khoản QR tĩnh
Đơn giản nhất, không cần merchant account:
- [ ] Tạo QR code ngân hàng (VietQR)
- [ ] Hiển thị QR sau khi khách submit form
- [ ] Admin xác nhận thủ công trong dashboard

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
