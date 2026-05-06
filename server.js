require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Email (optional) ──────────────────────────────────────────────────────────
let mailer = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendNotification(order) {
  if (!mailer || !process.env.NOTIFY_EMAIL) return;
  try {
    await mailer.sendMail({
      from: `"Sheraton Mooncake" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `[Đơn Mới] ${order.name || order.phone} – ${order.product || 'Tư vấn'}`,
      html: `
        <h2 style="color:#c9a84c">Đơn hàng mới – Bánh Trung Thu Sheraton</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Tên</td><td style="padding:8px;border:1px solid #ddd">${order.name || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Điện thoại</td><td style="padding:8px;border:1px solid #ddd">${order.phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${order.email || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Sản phẩm</td><td style="padding:8px;border:1px solid #ddd">${order.product || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Số lượng</td><td style="padding:8px;border:1px solid #ddd">${order.quantity}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Ghi chú</td><td style="padding:8px;border:1px solid #ddd">${order.message || '—'}</td></tr>
        </table>
        <p style="color:#888;margin-top:16px;font-size:12px">Gửi lúc ${new Date().toLocaleString('vi-VN')}</p>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
}

// ── POST /api/orders ──────────────────────────────────────────────────────────
app.post('/api/orders', (req, res) => {
  const { name, phone, email, product, quantity, message } = req.body;
  if (!phone || phone.trim().length < 9)
    return res.status(400).json({ error: 'Số điện thoại không hợp lệ.' });

  const order = db.insert({ name, phone: phone.trim(), email, product, quantity, message });
  sendNotification(order);
  res.status(201).json({ success: true, id: order.id });
});

// ── Admin auth middleware ──────────────────────────────────────────────────────
function adminAuth(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ── GET /api/orders ───────────────────────────────────────────────────────────
app.get('/api/orders', adminAuth, (req, res) => {
  const { status, search } = req.query;
  const orders = db.getAll({ status, search });
  const stats = db.getStats();
  res.json({ orders, stats });
});

// ── PATCH /api/orders/:id ─────────────────────────────────────────────────────
app.patch('/api/orders/:id', adminAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'contacted', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.updateStatus(req.params.id, status);
  res.json({ success: true });
});

// ── DELETE /api/orders/:id ────────────────────────────────────────────────────
app.delete('/api/orders/:id', adminAuth, (req, res) => {
  db.delete(req.params.id);
  res.json({ success: true });
});

// ── POST /api/admin/login ─────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD)
    return res.json({ success: true, token: ADMIN_PASSWORD });
  res.status(401).json({ error: 'Sai mật khẩu.' });
});

app.listen(PORT, () => {
  console.log(`\n🌙 Sheraton Mooncake → http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard  → http://localhost:${PORT}/admin.html`);
  console.log(`🔑 Admin password   : ${ADMIN_PASSWORD}\n`);
});
