// Client-side Mock Database and Fetch Interceptor
// Automatically runs if the backend server is offline/unavailable.

const DEMO_ITEMS = [
  { id: 1, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection with spices', price: 280, category: 'Starters', isAvailable: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Veg Spring Rolls', description: 'Crispy rolls stuffed with fresh vegetables', price: 180, category: 'Starters', isAvailable: true, image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Dal Makhani', description: 'Creamy black lentils slow-cooked overnight', price: 220, category: 'Veg', isAvailable: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Palak Paneer', description: 'Cottage cheese in rich spinach gravy', price: 260, category: 'Veg', isAvailable: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Veg Biryani', description: 'Aromatic basmati rice with seasonal vegetables & saffron', price: 300, category: 'Veg', isAvailable: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Butter Chicken', description: 'Tender chicken in creamy tomato butter sauce', price: 380, category: 'Non-Veg', isAvailable: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'Chicken Biryani', description: 'Fragrant long-grain rice layered with spiced chicken', price: 420, category: 'Non-Veg', isAvailable: true, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: 'Mutton Rogan Josh', description: 'Slow-cooked Kashmiri mutton with whole spices', price: 520, category: 'Non-Veg', isAvailable: true, image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80' },
  { id: 9, name: 'Mango Lassi', description: 'Chilled yogurt drink blended with fresh Alphonso mango', price: 120, category: 'Drinks', isAvailable: true, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=80' },
  { id: 10, name: 'Fresh Lime Soda', description: 'Refreshing lime juice with soda, sweet or salted', price: 80, category: 'Drinks', isAvailable: true, image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=800&q=80' },
  { id: 11, name: 'Masala Chai', description: 'Traditional spiced Indian tea with milk', price: 60, category: 'Drinks', isAvailable: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' },
  { id: 12, name: 'Red Wine (Glass)', description: 'Premium Sula Shiraz, full-bodied red wine', price: 450, category: 'Wine & Beer', isAvailable: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' },
  { id: 13, name: 'Premium Beer', description: 'Chilled Kingfisher Ultra premium lager', price: 280, category: 'Wine & Beer', isAvailable: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80' },
  { id: 14, name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose syrup', price: 140, category: 'Desserts', isAvailable: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { id: 15, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey molten centre', price: 220, category: 'Desserts', isAvailable: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
];

function getStorage(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage write error", e);
  }
}

// Initialize Mock Databases
if (!localStorage.getItem('mock_menu')) {
  setStorage('mock_menu', DEMO_ITEMS);
}
if (!localStorage.getItem('mock_users')) {
  // Add a default admin and customer user
  setStorage('mock_users', [
    { id: 1, name: 'Admin User', email: 'admin@hotel.com', password: 'password', role: 'ADMIN' },
    { id: 2, name: 'Guest Customer', email: 'user@hotel.com', password: 'password', role: 'CUSTOMER' }
  ]);
}
if (!localStorage.getItem('mock_orders')) {
  setStorage('mock_orders', []);
}

// Helper to construct response
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Intercept window.fetch
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
  const urlStr = url.toString();
  
  // Only intercept if url is targeting /api endpoints
  if (!urlStr.includes('/api')) {
    return originalFetch.apply(this, arguments);
  }

  try {
    // Try the real network request first
    const response = await originalFetch.apply(this, arguments);
    return response;
  } catch (err) {
    console.warn("⚠️ API server unreachable, falling back to client-side database simulation:", err);
    return handleMockRequest(urlStr, options);
  }
};

function handleMockRequest(urlStr, options) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = options.headers || {};
  const authHeader = headers['Authorization'] || headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  
  // Parse payload/body
  let body = {};
  if (options.body) {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = {};
    }
  }

  // Get current state from storage
  let users = getStorage('mock_users', []);
  let menu = getStorage('mock_menu', []);
  let orders = getStorage('mock_orders', []);

  // Determine current user from token
  let currentUser = null;
  if (token && token.startsWith('mock_token_')) {
    const userId = parseInt(token.replace('mock_token_', ''));
    currentUser = users.find(u => u.id === userId) || null;
  }

  // Router simulator
  try {
    // ─── AUTHENTICATION ────────────────────────────────────────────────────────
    if (urlStr.endsWith('/api/auth/register')) {
      const { name, email, password, role } = body;
      if (!email) {
        return jsonResponse({ error: 'Email is required' }, 400);
      }
      if (users.find(u => u.email === email)) {
        return jsonResponse({ error: 'Email already exists' }, 409);
      }
      const newUser = {
        id: Date.now(),
        name: name || 'Guest User',
        email,
        password: password || 'password', // stored in plain text for simple offline mock
        role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
      };
      users.push(newUser);
      setStorage('mock_users', users);

      return jsonResponse({
        token: `mock_token_${newUser.id}`,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      }, 201);
    }

    if (urlStr.endsWith('/api/auth/login')) {
      const { email } = body;
      const user = users.find(u => u.email === email);
      if (!user) {
        return jsonResponse({ error: 'User not found' }, 404);
      }
      return jsonResponse({
        token: `mock_token_${user.id}`,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }, 200);
    }

    if (urlStr.endsWith('/api/auth/me')) {
      if (!currentUser) return jsonResponse({ error: 'Unauthorized' }, 401);
      return jsonResponse({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      }, 200);
    }

    // ─── MENU ITEMS ───────────────────────────────────────────────────────────
    if (urlStr.includes('/api/menu')) {
      // GET single item /api/menu/:id
      const idMatch = urlStr.match(/\/api\/menu\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = menu.find(m => m.id === id);
        if (method === 'GET') {
          if (!item) return jsonResponse({ error: 'Item not found' }, 404);
          return jsonResponse(item, 200);
        }
        if (method === 'PUT') {
          if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
          if (!item) return jsonResponse({ error: 'Item not found' }, 404);
          
          const updated = { ...item, ...body, price: body.price ? parseFloat(body.price) : item.price };
          const updatedMenu = menu.map(m => m.id === id ? updated : m);
          setStorage('mock_menu', updatedMenu);
          return jsonResponse(updated, 200);
        }
        if (method === 'DELETE') {
          if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
          const updatedMenu = menu.filter(m => m.id !== id);
          setStorage('mock_menu', updatedMenu);
          return jsonResponse({ message: 'Item deleted' }, 200);
        }
      }

      // GET all items or POST new item
      if (method === 'GET') {
        // Simple filter by availability for customer page
        return jsonResponse(menu.filter(m => m.isAvailable), 200);
      }
      if (method === 'POST') {
        if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
        const { name, description, price, category, image } = body;
        if (!name || !price || !category) {
          return jsonResponse({ error: 'name, price, and category are required' }, 400);
        }
        const newItem = {
          id: Date.now(),
          name,
          description: description || '',
          price: parseFloat(price),
          category,
          image: image || null,
          isAvailable: true
        };
        menu.unshift(newItem); // put at top
        setStorage('mock_menu', menu);
        return jsonResponse(newItem, 201);
      }
    }

    // ─── UPLOADS ──────────────────────────────────────────────────────────────
    if (urlStr.endsWith('/api/upload')) {
      if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
      // Just return a placeholder image url
      return jsonResponse({ url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' }, 200);
    }

    // ─── ORDERS ───────────────────────────────────────────────────────────────
    if (urlStr.includes('/api/orders')) {
      // PUT order status /api/orders/:id/status
      const statusMatch = urlStr.match(/\/api\/orders\/(\d+)\/status/);
      if (statusMatch) {
        if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
        const id = parseInt(statusMatch[1]);
        const order = orders.find(o => o.id === id);
        if (!order) return jsonResponse({ error: 'Order not found' }, 404);
        
        order.status = body.status;
        setStorage('mock_orders', orders);
        return jsonResponse(order, 200);
      }

      // GET personal orders
      if (urlStr.endsWith('/api/orders/my')) {
        if (!currentUser) return jsonResponse({ error: 'Unauthorized' }, 401);
        const myOrders = orders.filter(o => o.userId === currentUser.id);
        return jsonResponse(myOrders, 200);
      }

      // GET all orders or POST new order
      if (method === 'GET') {
        if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
        return jsonResponse(orders, 200);
      }

      if (method === 'POST') {
        if (!currentUser) return jsonResponse({ error: 'Unauthorized' }, 401);
        const { items, specialInstructions, roomNumber, paymentMethod } = body;
        if (!items || !items.length) return jsonResponse({ error: 'Order items required' }, 400);
        if (!roomNumber) return jsonResponse({ error: 'Room number is required for delivery' }, 400);

        let totalAmount = 0;
        const populatedItems = items.map(itemInfo => {
          const menuItem = menu.find(m => m.id === itemInfo.menuId);
          if (!menuItem) throw new Error(`Menu item ${itemInfo.menuId} not found`);
          const price = menuItem.price * itemInfo.quantity;
          totalAmount += price;
          return {
            id: Date.now() + Math.random(),
            menuId: itemInfo.menuId,
            quantity: itemInfo.quantity,
            price,
            menu: menuItem
          };
        });

        const newOrder = {
          id: Math.floor(Math.random() * 90000) + 10000, // beautiful 5 digit order id
          userId: currentUser.id,
          totalAmount,
          roomNumber,
          paymentMethod: paymentMethod || 'CASH',
          status: 'PENDING',
          specialInstructions: specialInstructions || null,
          items: populatedItems,
          createdAt: new Date().toISOString(),
          user: { name: currentUser.name, email: currentUser.email }
        };

        orders.unshift(newOrder);
        setStorage('mock_orders', orders);
        return jsonResponse(newOrder, 201);
      }
    }

    // ─── ADMIN STATS ──────────────────────────────────────────────────────────
    if (urlStr.endsWith('/api/admin/stats')) {
      if (!currentUser || currentUser.role !== 'ADMIN') return jsonResponse({ error: 'Admin access required' }, 403);
      
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      // Get unique customer count
      const uniqueCustomers = new Set(orders.map(o => o.userId));

      return jsonResponse({
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: uniqueCustomers.size || 1, // fallback to at least 1
        pendingOrders,
        menuCount: menu.length
      }, 200);
    }

    // Fallback/Not Found
    return jsonResponse({ error: 'Mock endpoint not implemented' }, 404);
  } catch (e) {
    return jsonResponse({ error: e.message }, 500);
  }
}
