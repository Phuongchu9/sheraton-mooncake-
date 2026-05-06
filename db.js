const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'orders.json');

function load() {
  if (!fs.existsSync(DB_FILE)) return { orders: [], nextId: 1 };
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return { orders: [], nextId: 1 }; }
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const db = {
  insert(order) {
    const data = load();
    const newOrder = {
      id: data.nextId++,
      name: order.name || null,
      phone: order.phone,
      email: order.email || null,
      product: order.product || null,
      quantity: Number(order.quantity) || 1,
      message: order.message || null,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    data.orders.push(newOrder);
    save(data);
    return newOrder;
  },

  getAll({ status, search } = {}) {
    const data = load();
    let orders = [...data.orders];
    if (status && status !== 'all') orders = orders.filter(o => o.status === status);
    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(o =>
        (o.name && o.name.toLowerCase().includes(s)) ||
        (o.phone && o.phone.includes(s)) ||
        (o.email && o.email.toLowerCase().includes(s))
      );
    }
    return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getStats() {
    const { orders } = load();
    return {
      total: orders.length,
      new_count: orders.filter(o => o.status === 'new').length,
      contacted_count: orders.filter(o => o.status === 'contacted').length,
      completed_count: orders.filter(o => o.status === 'completed').length,
    };
  },

  updateStatus(id, status) {
    const data = load();
    const order = data.orders.find(o => o.id === Number(id));
    if (order) { order.status = status; save(data); }
    return order;
  },

  delete(id) {
    const data = load();
    data.orders = data.orders.filter(o => o.id !== Number(id));
    save(data);
  },

  getById(id) {
    return load().orders.find(o => o.id === Number(id));
  },
};

module.exports = db;
