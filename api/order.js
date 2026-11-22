import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const ORDERS_FILE = join(process.env.VERCEL ? tmpdir() : process.cwd(), 'orders.json');

function loadOrders() {
  if (!existsSync(ORDERS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveOrder(order) {
  try {
    const orders = loadOrders();
    orders.push(order);
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (e) {
    console.error('Could not persist order', e.message);
  }
}

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ orders: loadOrders() });
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
          res.status(400).json({ success: false, message: 'Cart is empty' });
          return;
        }
        if (!payload.name || !payload.email || !payload.address) {
          res.status(400).json({ success: false, message: 'Missing shipping details' });
          return;
        }
        const order = {
          id: 'TV-' + Date.now(),
          createdAt: new Date().toISOString(),
          ...payload,
          status: 'confirmed'
        };
        saveOrder(order);
        res.status(200).json({ success: true, orderId: order.id, message: 'Order confirmed' });
      } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid order data' });
      }
    });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
