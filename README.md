# 🍽️ Restaurant Management System

A full-stack restaurant/hotel management web application built with **React** (frontend) and **Node.js / Express** (backend), using **Prisma ORM** with an SQLite database.

---

## 🚀 Features

- 🔐 **Authentication** – JWT-based login/register for Customers and Admins
- 🍕 **Menu Management** – Browse, add, edit, and delete menu items (Admin)
- 🛒 **Cart & Orders** – Add items to cart, place orders with room number & payment method
- 📦 **Order Tracking** – Customers view their orders; Admins manage all orders
- 📊 **Admin Dashboard** – Stats: total orders, revenue, customers, pending orders, menu count
- 🖼️ **Image Uploads** – Admins can upload images for menu items
- 📱 **Responsive UI** – Built with React + Framer Motion animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Axios, Framer Motion, Lucide Icons |
| Backend | Node.js, Express 5, Prisma ORM, SQLite |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Dev Tools | Vite (frontend), Nodemon (backend) |

---

## 📂 Project Structure

```
hotel management system/
├── backend/
│   ├── server.js          # Express API server
│   ├── prisma/            # Prisma schema & migrations
│   ├── uploads/           # Uploaded images (local, not committed)
│   ├── seed.js            # Database seed script
│   └── .env               # Environment variables (not committed)
└── frontend/
    ├── src/
    │   ├── pages/         # React pages (Home, Cart, Orders, Admin…)
    │   ├── components/    # Reusable components
    │   └── index.css      # Global styles
    └── index.html
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js **v20+** (required for Vite 8)
- npm

### Backend

```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# JWT_SECRET=your_secret_key
npx prisma migrate dev
node seed.js        # (optional) seed sample data
npm run dev         # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/menu` | ❌ | Get all menu items |
| POST | `/api/menu` | Admin | Add menu item |
| PUT | `/api/menu/:id` | Admin | Update menu item |
| DELETE | `/api/menu/:id` | Admin | Delete menu item |
| POST | `/api/orders` | ✅ | Place an order |
| GET | `/api/orders/my` | ✅ | Get my orders |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| POST | `/api/upload` | Admin | Upload image |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
