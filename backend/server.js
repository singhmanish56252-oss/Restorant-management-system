import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const prisma = new PrismaClient({});
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .webp format allowed!'), false);
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Middleware: Authenticate Token ───────────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🍽️ Hotel Management API is running!' });
});

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true } });
  res.json(user);
});

// ─── UPLOAD ROUTE ─────────────────────────────────────────────────────────────

app.post('/api/upload', authenticate, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// ─── MENU ROUTES ──────────────────────────────────────────────────────────────

// Get all menu items (public)
app.get('/api/menu', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category, isAvailable: true } : { isAvailable: true };
    const items = await prisma.menu.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single menu item
app.get('/api/menu/:id', async (req, res) => {
  try {
    const item = await prisma.menu.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add menu item (Admin only)
app.post('/api/menu', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    if (!name || !price || !category) return res.status(400).json({ error: 'name, price, and category are required' });
    const item = await prisma.menu.create({ data: { name, description, price: parseFloat(price), category, image } });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu item (Admin only)
app.put('/api/menu/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    const item = await prisma.menu.update({
      where: { id: Number(req.params.id) },
      data: { name, description, price: price ? parseFloat(price) : undefined, category, image, isAvailable }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete menu item (Admin only)
app.delete('/api/menu/:id', authenticate, isAdmin, async (req, res) => {
  try {
    await prisma.menu.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ORDER ROUTES ─────────────────────────────────────────────────────────────

// Place new order
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { items, specialInstructions, roomNumber, paymentMethod } = req.body; // [{ menuId, quantity }]
    if (!items || !items.length) return res.status(400).json({ error: 'Order items required' });
    if (!roomNumber) return res.status(400).json({ error: 'Room number is required for delivery' });

    // Fetch prices for all items
    const menuIds = items.map(i => i.menuId);
    const menuItems = await prisma.menu.findMany({ where: { id: { in: menuIds } } });
    const menuMap = Object.fromEntries(menuItems.map(m => [m.id, m]));

    let totalAmount = 0;
    const orderItemsData = items.map(i => {
      const menu = menuMap[i.menuId];
      if (!menu) throw new Error(`Menu item ${i.menuId} not found`);
      const price = menu.price * i.quantity;
      totalAmount += price;
      return { menuId: i.menuId, quantity: i.quantity, price };
    });

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        roomNumber,
        paymentMethod: paymentMethod || 'CASH',
        specialInstructions: specialInstructions || null,
        items: { create: orderItemsData }
      },
      include: { items: { include: { menu: true } } }
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my orders (customer)
app.get('/api/orders/my', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { menu: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (Admin)
app.get('/api/orders', authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: { include: { menu: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (Admin)
app.put('/api/orders/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS (Admin) ────────────────────────────────────────────────────────────
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({ _sum: { totalAmount: true } });
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
    const menuCount = await prisma.menu.count();
    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalCustomers,
      pendingOrders,
      menuCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
